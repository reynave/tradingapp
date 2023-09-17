import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleChartsModule } from 'angular-google-charts';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { BacktestComponent } from './backtest/backtest.component';
import { HomeComponent } from './home/home.component';
import { BacktestDetailComponent } from './backtest/backtest-detail/backtest-detail.component';
import { ReloginComponent } from './login/relogin/relogin.component';
import { HeaderComponent } from './global/header/header.component';
import { JournalComponent } from './journal/journal.component';
import { BookComponent } from './book/book.component'; 
import { TemplateTableComponent } from './template/template-table/template-table.component';
import { CustomFieldComponent } from './template/custom-field/custom-field.component';
import { TableComponent } from './board/table/table.component';
import { CustomFieldFormComponent } from './template/custom-field-form/custom-field-form.component';
import { BoardViewComponent } from './global/board-view/board-view.component';
import { ChartjsComponent } from './board/chartjs/chartjs.component';
import { BoardTitleComponent } from './global/board-title/board-title.component';
import { ShareBoardComponent } from './template/share-board/share-board.component';
import { WidgetTeamsComponent } from './global/widget-teams/widget-teams.component';
import { InvitedComponent } from './login/invited/invited.component';
import { WidgetInviteComponent } from './global/widget-invite/widget-invite.component';
import { TablePrintableComponent } from './board/table-printable/table-printable.component';
import { OffCanvasNotesComponent } from './board/table/off-canvas-notes/off-canvas-notes.component';
import { OffCanvasImagesComponent } from './board/table/off-canvas-images/off-canvas-images.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { TabletEditSelectComponent } from './board/table/tablet-edit-select/tablet-edit-select.component';

const config: SocketIoConfig = { 
  url: environment.socket_url, 
  options: { transports: ['websocket'] } 
};

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LoginComponent,
    BacktestComponent,
    HomeComponent,
    BacktestDetailComponent,
    ReloginComponent,
    HeaderComponent,
    JournalComponent,
    BookComponent, 
    TemplateTableComponent,
    CustomFieldComponent,
    TableComponent,
    CustomFieldFormComponent,
    BoardViewComponent,
    ChartjsComponent,
    BoardTitleComponent,
    ShareBoardComponent,
    WidgetTeamsComponent,
    InvitedComponent,
    WidgetInviteComponent,
    TablePrintableComponent,
    OffCanvasNotesComponent,
    OffCanvasImagesComponent,
    TabletEditSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    GoogleChartsModule,
    EditorModule,
    NgbDatepickerModule,
    ClipboardModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
