import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbCollapse, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { ContentService } from '../../shared/services/content.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgbCollapse, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem],
  templateUrl: './navbar.html',
  styleUrl: './navbar.sass'
})
export class NavbarComponent {
  private readonly contentService = inject(ContentService);

  readonly modules = toSignal(this.contentService.getModulesIndex(), { initialValue: [] });
  navbarCollapsed = true;
}
