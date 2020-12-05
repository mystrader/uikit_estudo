import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LayoutService, AuthService } from '@cnj/uikit';

declare function require(path: string);

export interface Section {
  description: string;
  read: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  imageProfile = require('@cnj/uikit/lib/theme/uikit/images/bg-user.jpg');

  user$ = this.authService.user.user$;

  typesOfShoes: Section[] = [
    {
      description:
        'Despachar o processo 000912.2323.423.3535 para o gabinete do Dr. Ricardo, no dia 15/12/2018. Ligar para confirmar recebimento.',
      read: true
    },
    {
      description:
        'Despachar o processo 000912.2323.423.3535 para o gabinete do Dr. Ricardo, no dia 15/12/2018. Ligar para confirmar recebimento.',
      read: false
    },
    {
      description:
        'Despachar o processo 000912.2323.423.3535 para o gabinete do Dr. Ricardo, no dia 15/12/2018. Ligar para confirmar recebimento.',
      read: false
    }
  ];
  constructor(
    protected authService: AuthService) { }

  ngOnInit() { }
}
