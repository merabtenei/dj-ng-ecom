import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logged-in-navbar-status',
  templateUrl: './logged-in-navbar-status.component.html',
  styleUrls: ['./logged-in-navbar-status.component.scss'],
})
export class LoggedInNavbarStatusComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
