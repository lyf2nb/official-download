const express = require('express')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = process.env.PORT || 3000
const DATA_FILE = path.join(__dirname, 'data.json')
const BACKUP_FILE = path.join(__dirname, 'data.backup.json')

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// ── 内存缓存 ──
let _cache = null

function readData() {
  if (_cache) return _cache
  try {
    _cache = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    return _cache
  } catch (e) {
    console.error('❌ 读取 data.json 失败，尝试从备份恢复:', e.message)
    try {
      _cache = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'))
      console.log('✅ 已从备份文件恢复数据')
      return _cache
    } catch (e2) {
      console.error('❌ 备份文件也读取失败:', e2.message)
      throw new Error('数据文件损坏且无法从备份恢复')
    }
  }
}

// 每10次写入备份一次
let _writeCount = 0
function writeData(data) {
  _cache = data
  const json = JSON.stringify(data, null, 2)
  fs.writeFileSync(DATA_FILE, json, 'utf-8')
  _writeCount++
  if (_writeCount >= 10) {
    _writeCount = 0
    try {
      fs.writeFileSync(BACKUP_FILE, json, 'utf-8')
      console.log('💾 已备份 data.json → data.backup.json')
    } catch (e) {
      console.error('⚠️  备份失败:', e.message)
    }
  }
}

// ====== 新增：密码校验 ======
function checkPassword(pwd) {
  return pwd && pwd === process.env.ADMIN_TOKEN
}

// ====== 改动：公开接口过滤未审核链接 ======
app.get('/api/data', (req, res) => {
  const data = readData()
  const filtered = {
    ...data,
    software: data.software.map(sw => ({
      ...sw,
      crackedLinks: sw.crackedLinks.filter(l => l.approved !== false)
    }))
  }
  res.json(filtered)
})

// ====== 新增：获取待审核列表（需密码） ======
app.get('/api/pending', (req, res) => {
  if (!checkPassword(req.headers['x-admin-token'])) return res.status(403).json({ error: '密码错误' })

  const data = readData()
  const pending = []
  for (const sw of data.software) {
    for (const link of sw.crackedLinks) {
      if (link.approved === false) {
        pending.push({ ...link, softwareId: sw.id, softwareName: sw.name })
      }
    }
  }
  res.json(pending)
})

// ====== 改动：提交链接支持密码，有密码直接发布，无密码进审核 ======
app.post('/api/software/:id/cracked', (req, res) => {
  const { label, url, password } = req.body
  if (!label || !url) return res.status(400).json({ error: '缺少参数' })

  const data = readData()
  const sw = data.software.find(s => s.id === req.params.id)
  if (!sw) return res.status(404).json({ error: '软件不存在' })

  const isAdmin = checkPassword(password)

  const newLink = {
    id: uuidv4(),
    label,
    url,
    likes: 0,
    dislikes: 0,
    submittedAt: new Date().toISOString().slice(0, 10),
    approved: isAdmin ? true : false   // ← 新增字段
  }
  sw.crackedLinks.push(newLink)
  writeData(data)
  res.json({ ...newLink, isAdmin })
})

// ====== 审核软件（通过/拒绝）—— 必须在通用 :softwareId/:linkId 路由之前 ======
app.post('/api/review/software/:id', (req, res) => {
  if (!checkPassword(req.headers['x-admin-token'])) return res.status(403).json({ error: '密码错误' })
  const { approved } = req.body
  const data = readData()
  if (!data.pendingSoftware) return res.status(404).json({ error: '无待审核软件' })
  const idx = data.pendingSoftware.findIndex(s => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: '软件不存在' })
  const [sw] = data.pendingSoftware.splice(idx, 1)
  if (approved) data.software.push(sw)
  writeData(data)
  res.json({ ok: true })
})

// ====== 审核分类（通过/拒绝）—— 必须在通用 :softwareId/:linkId 路由之前 ======
app.post('/api/review/category/:id', (req, res) => {
  if (!checkPassword(req.headers['x-admin-token'])) return res.status(403).json({ error: '密码错误' })
  const { approved } = req.body
  const data = readData()
  if (!data.pendingCategories) return res.status(404).json({ error: '无待审核分类' })
  const idx = data.pendingCategories.findIndex(c => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: '分类不存在' })
  const [cat] = data.pendingCategories.splice(idx, 1)
  if (approved) data.categories.push(cat)
  writeData(data)
  res.json({ ok: true })
})

// ====== 链接审核接口（通过/拒绝）—— 通用路由放最后 ======
app.post('/api/review/:softwareId/:linkId', (req, res) => {
  if (!checkPassword(req.headers['x-admin-token'])) return res.status(403).json({ error: '密码错误' })

  const { approved } = req.body
  const data = readData()
  const sw = data.software.find(s => s.id === req.params.softwareId)
  if (!sw) return res.status(404).json({ error: '软件不存在' })

  const link = sw.crackedLinks.find(l => l.id === req.params.linkId)
  if (!link) return res.status(404).json({ error: '链接不存在' })

  if (approved) {
    link.approved = true
  } else {
    sw.crackedLinks = sw.crackedLinks.filter(l => l.id !== link.id)
  }
  writeData(data)
  res.json({ ok: true })
})

// ====== 新增：删除已上线软件 ======
app.delete('/api/software/:id', (req, res) => {
  if (!checkPassword(req.headers['x-admin-token'])) return res.status(403).json({ error: '无权限' })
  const data = readData()
  const idx = data.software.findIndex(s => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: '软件不存在' })
  data.software.splice(idx, 1)
  writeData(data)
  res.json({ ok: true })
})

// ====== 新增：删除已上线分类 ======
app.delete('/api/category/:id', (req, res) => {
  if (!checkPassword(req.headers['x-admin-token'])) return res.status(403).json({ error: '无权限' })
  const data = readData()
  const idx = data.categories.findIndex(c => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: '分类不存在' })
  data.categories.splice(idx, 1)
  // 同时把该分类下的软件一并移除（可选，防止孤儿数据）
  data.software = data.software.filter(s => s.category !== req.params.id)
  writeData(data)
  res.json({ ok: true })
})

// ====== 原有：投票（未动） ======
app.post('/api/vote/:softwareId/:linkId/:type', (req, res) => {
  const { softwareId, linkId, type } = req.params
  if (!['like', 'dislike'].includes(type)) return res.status(400).json({ error: '类型错误' })

  const data = readData()
  const sw = data.software.find(s => s.id === softwareId)
  if (!sw) return res.status(404).json({ error: '软件不存在' })

  const link = sw.crackedLinks.find(l => l.id === linkId)
  if (!link) return res.status(404).json({ error: '链接不存在' })

  if (type === 'like') link.likes++
  else link.dislikes++

  writeData(data)
  res.json({ likes: link.likes, dislikes: link.dislikes })
})

// ====== 原有：删除（未动） ======
app.delete('/api/software/:id/cracked/:linkId', (req, res) => {
  if (!checkPassword(req.headers['x-admin-token'])) return res.status(403).json({ error: '无权限' })

  const data = readData()
  const sw = data.software.find(s => s.id === req.params.id)
  if (!sw) return res.status(404).json({ error: '软件不存在' })

  sw.crackedLinks = sw.crackedLinks.filter(l => l.id !== req.params.linkId)
  writeData(data)
  res.json({ ok: true })
})

// ====== 新增：提交新软件（有密码直接发布，无密码进审核） ======
app.post('/api/submit/software', (req, res) => {
  const { name, category, description, icon, officialUrl, officialDownload, password } = req.body
  if (!name || !category || !officialUrl || !officialDownload) {
    return res.status(400).json({ error: '缺少必填参数：名称、分类、官网、官方下载地址' })
  }
  const data = readData()
  const catExists = data.categories.find(c => c.id === category)
  if (!catExists) return res.status(400).json({ error: '分类不存在' })

  const isAdmin = checkPassword(password)
  const id = uuidv4()
  const newSoftware = {
    id,
    name,
    category,
    description: description || '',
    icon: icon || '',
    officialUrl,
    officialDownload,
    crackedLinks: [],
    submittedAt: new Date().toISOString().slice(0, 10)
  }

  if (!data.pendingSoftware) data.pendingSoftware = []
  if (isAdmin) {
    data.software.push(newSoftware)
  } else {
    data.pendingSoftware.push(newSoftware)
  }
  writeData(data)
  res.json({ ...newSoftware, isAdmin })
})

// ====== 新增：提交新分类（有密码直接发布，无密码进审核） ======
app.post('/api/submit/category', (req, res) => {
  const { name, icon, password } = req.body
  if (!name) return res.status(400).json({ error: '缺少分类名称' })

  const data = readData()
  const isAdmin = checkPassword(password)
  const id = 'cat-' + uuidv4()
  const newCategory = {
    id,
    name,
    icon: icon || '📁',
    submittedAt: new Date().toISOString().slice(0, 10)
  }

  if (!data.pendingCategories) data.pendingCategories = []
  if (isAdmin) {
    data.categories.push(newCategory)
  } else {
    data.pendingCategories.push(newCategory)
  }
  writeData(data)
  res.json({ ...newCategory, isAdmin })
})

// ====== 新增：获取待审核软件列表（需密码） ======
app.get('/api/pending/software', (req, res) => {
  if (!checkPassword(req.headers['x-admin-token'])) return res.status(403).json({ error: '密码错误' })
  const data = readData()
  res.json(data.pendingSoftware || [])
})

// ====== 新增：获取待审核分类列表（需密码） ======
app.get('/api/pending/categories', (req, res) => {
  if (!checkPassword(req.headers['x-admin-token'])) return res.status(403).json({ error: '密码错误' })
  const data = readData()
  res.json(data.pendingCategories || [])
})

// ====== 新增：编辑已上线软件信息 ======
app.patch('/api/software/:id', (req, res) => {
  if (!checkPassword(req.headers['x-admin-token'])) return res.status(403).json({ error: '无权限' })
  const { name, category, description, icon, officialUrl, officialDownload } = req.body
  const data = readData()
  const sw = data.software.find(s => s.id === req.params.id)
  if (!sw) return res.status(404).json({ error: '软件不存在' })
  if (category) {
    const catExists = data.categories.find(c => c.id === category)
    if (!catExists) return res.status(400).json({ error: '分类不存在' })
    sw.category = category
  }
  if (name !== undefined) sw.name = name
  if (description !== undefined) sw.description = description
  if (icon !== undefined) sw.icon = icon
  if (officialUrl !== undefined) sw.officialUrl = officialUrl
  if (officialDownload !== undefined) sw.officialDownload = officialDownload
  writeData(data)
  res.json({ ok: true, software: sw })
})

app.listen(PORT, () => {
  console.log(`✅ 服务运行在 http://localhost:${PORT}`)
})

// ====== 全局错误处理，防止未捕获异常崩溃 ======
app.use((err, req, res, next) => {
  console.error('❌ 未捕获的路由错误:', err.message)
  res.status(500).json({ error: '服务器内部错误' })
})
