import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from '../../shop-services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'shop',
  templateUrl: './shop-landing.component.html',
  styleUrls: ['./shop-landing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopLandingComponent implements OnInit {
  Category$: Observable<Category[]>;
  constructor(private route: Router, private categoryService: CategoryService) {
    // this.categoryService.updateIsUsedCategoryList()
  }

  ngOnInit(): void {
    this.Category$ = this.categoryService.getCategoryList();
  }

  sTitle = 'Made To Shopping By Categories';
  sMobileTitle = 'Shopping';

  backToHome() {
    this.route.navigate(['home']);
  }
}
