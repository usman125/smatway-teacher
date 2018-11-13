var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { TripService } from "../../services/trip-service";
import { TripDetailPage } from "../trip-detail/trip-detail";
var TripsPage = /** @class */ (function () {
    function TripsPage(nav, tripService) {
        this.nav = nav;
        this.tripService = tripService;
        // set sample data
        this.trips = tripService.getAll();
    }
    // view trip detail
    TripsPage.prototype.viewDetail = function (id) {
        this.nav.push(TripDetailPage, { id: id });
    };
    TripsPage = __decorate([
        Component({
            selector: 'page-trips',
            templateUrl: 'trips.html'
        }),
        __metadata("design:paramtypes", [NavController, TripService])
    ], TripsPage);
    return TripsPage;
}());
export { TripsPage };
//# sourceMappingURL=trips.js.map