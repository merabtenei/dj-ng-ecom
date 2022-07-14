import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/models/category';
import { ViewsetRestApiService } from 'src/app/shared/services/viewset-rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(public restApi: ViewsetRestApiService) {}

  ngOnInit(): void {}
}
