import { Component, Input } from '@angular/core';
import { JUser } from '@trungk18/interface/user';

@Component({
  selector: 'j-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  @Input() user: JUser;

  constructor() {}
  getUserAvatarUrl(user: any): string {
    const baseUrl = 'https://ui-avatars.com/api/?name=';
    const username = user.name.toLowerCase().replace(/\s/g, '');
    return `${baseUrl}${username}.jpg`;
  }
}
