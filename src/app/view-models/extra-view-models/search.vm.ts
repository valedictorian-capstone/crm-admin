import { CustomerVM } from '../basic-view-models';
import { ActivityVM, AttachmentVM, DealVM } from '../deal-view-models';

export class SearchVM {
  type: string;
  data: (DealVM | CustomerVM | ActivityVM | AttachmentVM)[];
}
