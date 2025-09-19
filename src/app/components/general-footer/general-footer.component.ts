import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general-footer',   // 👈 usar convención app-
  standalone: true,
  imports: [CommonModule],
  templateUrl: './general-footer.component.html',
  styleUrls: ['./general-footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralFooterComponent {
  public currentYear = new Date().getFullYear(); 
}
