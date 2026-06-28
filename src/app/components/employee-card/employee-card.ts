import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  templateUrl: './employee-card.html'
})
export class EmployeeCard {

  @Input() employee: any;

  @Output() edit = new EventEmitter<string>();

  @Output() delete = new EventEmitter<string>();

  editCount = 0;

  incrementEditCount() {
    this.editCount++;
  }

  onEdit() {
    this.edit.emit(this.employee.id);
  }

  onDelete() {
    this.delete.emit(this.employee.id);
  }
}
