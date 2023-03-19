import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCalendarKitModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbChatCustomMessageDirective,
  NbChatModule,
  NbIconModule,
  NbPopoverModule,
  NbProgressBarModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTableModule,
  NbTabsetModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ExtraComponentsRoutingModule } from './extra-components-routing.module';
import { AngularD3CloudModule } from 'angular-d3-cloud'
// components
import { ExtraComponentsComponent } from './extra-components.component';
import {
  InteractiveProgressBarComponent,
} from './progress-bar/interactive-progress-bar/interactive-progress-bar.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ChatComponent } from './chat/chat.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DayCellComponent } from './calendar/day-cell/day-cell.component';
import { NebularFormInputsComponent } from './form-inputs/nebular-form-inputs.component';
import { NebularSelectComponent } from './form-inputs/nebular-select/nebular-select.component';
import { CalendarKitFullCalendarShowcaseComponent } from './calendar-kit/calendar-kit.component';
import { CalendarKitMonthCellComponent } from './calendar-kit/month-cell/month-cell.component';
import { ECommerceModule } from '../e-commerce/e-commerce.module';
import 'heatmap.js';
import { PivotComponent } from './pivot/pivot.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';

const COMPONENTS = [
  ExtraComponentsComponent,
  DashboardComponent,
  ProgressBarComponent,
  InteractiveProgressBarComponent,
  CalendarComponent,
  DayCellComponent,
  ChatComponent,
  NebularFormInputsComponent,
  NebularSelectComponent,
  CalendarKitFullCalendarShowcaseComponent,
  CalendarKitMonthCellComponent,
  PivotComponent,
];

const MODULES = [
  NbAlertModule,
  FormsModule,
  NbActionsModule,
  NbButtonModule,
  NbCalendarModule,
  NbCalendarKitModule,
  NbCalendarRangeModule,
  NbPopoverModule,
  NbCardModule,
  NbChatModule,
  NbIconModule,
  NbProgressBarModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  ECommerceModule,
  Ng2SmartTableModule,
  ThemeModule,
  AngularD3CloudModule,
  ExtraComponentsRoutingModule,
];

@NgModule({
  imports: [
    ...MODULES,
  ],
  declarations: [
    ...COMPONENTS,
  ],
})
export class ExtraComponentsModule { }
