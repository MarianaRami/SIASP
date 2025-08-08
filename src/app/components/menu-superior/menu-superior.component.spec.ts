import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-superior',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-superior.component.html',
  styleUrl: './menu-superior.component.css'
})
export class MenuSuperiorComponent {
showLogoutMenu: any;
logout($event: MouseEvent) {
throw new Error('Method not implemented.');
}
toggleLogoutMenu() {
throw new Error('Method not implemented.');
}
user: any;

}