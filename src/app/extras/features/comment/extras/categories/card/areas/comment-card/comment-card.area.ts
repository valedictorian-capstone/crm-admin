import { Component, Input } from '@angular/core';
import { ICommentMainState } from '@extras/features/comment';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.area.html',
  styleUrls: ['./comment-card.area.scss']
})
export class CommentCardArea {
  @Input() state: ICommentMainState;
}
