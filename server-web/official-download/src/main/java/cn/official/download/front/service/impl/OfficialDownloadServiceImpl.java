package cn.official.download.front.service.impl;

import cn.official.download.front.dao.BaseSoftwareRepository;
import cn.official.download.front.dao.BaseTypeRepository;
import cn.official.download.front.model.BaseSoftware;
import cn.official.download.front.model.BaseType;
import cn.official.download.front.model.param.BaseSoftwareParam;
import cn.official.download.front.service.OfficialDownloadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * @author LYF
 */
@Service
public class OfficialDownloadServiceImpl implements OfficialDownloadService {
    @Autowired
    BaseTypeRepository baseTypeRepository;

    @Autowired
    BaseSoftwareRepository baseSoftwareRepository;

    @Override
    public List<BaseType> getAllType() {
        List<BaseType> all = baseTypeRepository.findAll();
        return all;
    }

    @Override
    public List<BaseSoftware> getBaseSoftwareByParam(BaseSoftwareParam param) {

        BaseSoftware baseSoftware = new BaseSoftware();
        baseSoftware.setName(param.getKeyword());
        baseSoftware.setAlias(param.getKeyword());
        baseSoftware.setAffordableAlternative(param.getKeyword());
        if (0 != param.getType()){
            baseSoftware.setSoftwareType(param.getType());
        }
        ExampleMatcher exampleMatcher = ExampleMatcher.matchingAny()
                .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.contains())
                .withMatcher("alias", ExampleMatcher.GenericPropertyMatchers.contains())
                .withMatcher("affordableAlternative", ExampleMatcher.GenericPropertyMatchers.contains());
        Example<BaseSoftware> example = Example.of(baseSoftware, exampleMatcher);

        Pageable pageable = Pageable.ofSize(10);

        Page<BaseSoftware> all = baseSoftwareRepository.findAll(new Specification<BaseSoftware>() {
            @Override
            public Predicate toPredicate(Root<BaseSoftware> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if (StringUtils.hasText(param.getKeyword())){
                    Predicate name = criteriaBuilder.like(root.get("name"), param.getKeyword());
                    Predicate alias = criteriaBuilder.like(root.get("alias"), param.getKeyword());
                    Predicate affordableAlternative = criteriaBuilder.like(root.get("affordableAlternative"), param.getKeyword());
                    predicates.add(name);
                    predicates.add(alias);
                    predicates.add(affordableAlternative);
                    Predicate or = criteriaBuilder.or(predicates.toArray(new Predicate[predicates.size()]));
                    if (0 == param.getType()) {
                        return or;
                    } else {
                        Predicate softwareType = criteriaBuilder.equal(root.get("softwareType"), param.getType());
                        return criteriaBuilder.and(or, softwareType);
                    }
                }else {
                    if (0 == param.getType()) {
                        return null;
                    } else {
                        return criteriaBuilder.equal(root.get("softwareType"), param.getType());
                    }
                }
            }
        }, pageable.withPage(param.getPage()));
        return all.toList();
    }
}
