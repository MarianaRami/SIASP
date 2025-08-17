import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-menu-izquierdo',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './menu-izquierdo.component.html',
  styleUrl: './menu-izquierdo.component.css'
})
export class MenuIzquierdoComponent {
openSidebar() {
throw new Error('Method not implemented.');
}
isOpen: any;
menuItems: any;
private sidebarService = inject(SidebarService);

}
