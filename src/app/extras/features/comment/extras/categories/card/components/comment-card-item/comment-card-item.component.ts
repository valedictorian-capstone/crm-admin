import { Component, Input } from '@angular/core';
import { CommentVM } from '@view-models';

@Component({
  selector: 'app-comment-card-item',
  templateUrl: './comment-card-item.component.html',
  styleUrls: ['./comment-card-item.component.scss']
})
export class CommentCardItemComponent {
  @Input() comment: CommentVM;
  show = true;
}
