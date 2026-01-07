package com.velon.controller.admin;

import com.velon.controller.base.BaseController;
import com.velon.dao.CarDAO;
import com.velon.model.entity.Car;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/cars")
public class AdminCarController extends BaseController {

    private final CarDAO carDAO;

    public AdminCarController(CarDAO carDAO) {
        this.carDAO = carDAO;
    }

    @PostMapping
    public Object addCar(@RequestBody Car car) {
        if (car.getStatus() == null) {
            car.setStatus("AVAILABLE");
        }
        return ok(carDAO.save(car));
    }
}
