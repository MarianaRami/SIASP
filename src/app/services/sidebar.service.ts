import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private isSidebarOpen = signal<boolean>(false);

  get sidebarState() {
    return this.isSidebarOpen();
  }

  public toggleSidebar() {
    this.isSidebarOpen.update((open) => !open);
  }

  public openSidebar() {
    this.isSidebarOpen.set(true);
  }

  public closeSidebar() {
    this.isSidebarOpen.set(false);
  }
}
