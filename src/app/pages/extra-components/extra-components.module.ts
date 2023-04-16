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
import { ChatComponent } from './chat/chat.component';
import { ECommerceModule } from '../e-commerce/e-commerce.module';
import 'heatmap.js';
import { PivotComponent } from './pivot/pivot.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DesignerModule } from '../designer/designer.module';

const COMPONENTS = [
  ExtraComponentsComponent,
  DashboardComponent,
  ChatComponent,
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
  DesignerModule,
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
