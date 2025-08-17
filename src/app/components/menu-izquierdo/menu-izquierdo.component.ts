import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-menu-izquierdo',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './menu-izquierdo.component.html',
  styleUrl: './menu-izquierdo.component.css'
})
export class MenuIzquierdoComponent {
  //public sidebarService = inject(SidebarService);

  //isOpen = computed(() => this.sidebarService.sidebarState);
}
