import { inject, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  GridModule,
  EditService,
  ToolbarService,
  SortService,
  PageService,
} from '@syncfusion/ej2-angular-grids';
import {
  DropDownListComponent,
  DropDownListModule,
} from '@syncfusion/ej2-angular-dropdowns';
import {
  TextBoxModule,
  NumericTextBoxAllModule,
} from '@syncfusion/ej2-angular-inputs';
import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import {
  GridComponent,
  RowSelectEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { data } from './datasource';
import { DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';
import { MySerService } from './my-ser.service';
import { AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  imports: [
    GridModule,
    FormsModule,
    TextBoxModule,
    ButtonModule,
    NumericTextBoxAllModule,
    DropDownListModule,
    DialogModule,
    AsyncPipe,
    HttpClientModule,
  ],
  providers: [
    EditService,
    ToolbarService,
    SortService,
    PageService,
    MySerService,
  ],
  standalone: true,
  selector: 'app-root',
  template: `
         <div class="row" >
              <div class="col-xs-6 col-md-3">
                <div>
                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <label for="orderedit">OrderID</label>
                      <input class="form-control" [(ngModel)]="selectedProduct.OrderID" type="number" disabled />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <label for="customeredit">CustomerID</label>
                      <ejs-textbox [(value)]="selectedProduct.CustomerID"></ejs-textbox>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <label for="freightedit">Frieght</label>
                      <ejs-numerictextbox [(value)]="selectedProduct.Freight"></ejs-numerictextbox>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-12">
                      <label for="countryedit">ShipCountry</label>
                      <ejs-dropdownlist #ddlelement [(value)]="selectedProduct.ShipCountry" [dataSource]="dropdown">
                      <ng-template #footerTemplate="" let-data="">
                        <button ej-button (click)="openDialog()">Add item</button>
                      </ng-template>
                      </ejs-dropdownlist>
                    </div>
                  </div>
                </div>
                <button ejs-button id="btn" (click)="save()">Save</button>
              </div>
              <div class="col-xs-6 col-md-9">
                <ejs-grid #grid [dataSource]="orders" height="315" width="500px" (rowSelected)="rowSelectHandler($event)" [editSettings]="editSettings">
                  <e-columns>
                    <e-column field="OrderID" headerText="OrderID" isPrimaryKey="true" textAlign="Right" width="120"></e-column>
                    <e-column field="CustomerID" headerText="CustomerID" textAlign="Right" width="120"></e-column>
                    <e-column field="Freight" headerText="Freight" textAlign="Right" format="C2" width="120"></e-column>
                    <e-column field="ShipCountry" headerText="ShipCountry" textAlign="Right" width="120"></e-column>
                  </e-columns>
                </ejs-grid>
              </div>
            </div>
            <div id="dialog-container">
    <ejs-dialog
      id="dialog"
      #ejDialog
      target="#dialog-container"
      [showCloseIcon]="true"
      width="350px"
      [visible]="false"
    >
      <ng-template #content>
        <input #in placeholder="Input with warning" type="text" />
        <button ej-button (click)="addItem(in.value)">Add item</button>
      </ng-template>
    </ejs-dialog>
  </div>
           `,
})
export class AppComponent implements OnInit {
  public orders: Object[] = data;
  myser = inject(MySerService);
  @ViewChild('grid') public grid?: GridComponent;
  public dropdown$ = this.myser.getAll();
  public dropdown: any = [];
  public selectedProduct: Order = new Order();
  public dropdownFields: Object = { text: 'shipCountry', value: 'shipCountry' };
  public editSettings: Object = { allowEditing: true };

  @ViewChild('ddlelement')
  public dropDownListObject = DropDownListComponent;

  @ViewChild('ejDialog') ejDialog: DialogComponent | undefined;

  addItem(val: any) {
    this.myser.add({ body: val, title: val, userId: 1 }).subscribe(() => {
      (this.dropDownListObject as any).addItem({ text: val, value: val }, 0);
      (this.dropDownListObject as any).value = val;
      this.ejDialog?.hide();
    });
  }

  ngOnInit() {
    this.dropdown$.subscribe((res) => {
      console.log(res);
      this.dropdown = res;
    });
  }

  openDialog(): void {
    // Call the show method to open the Dialog
    this.ejDialog?.show();
  }

  save(): void {
    const index = (this.grid as GridComponent).getSelectedRowIndexes()[0];
    (this.grid as GridComponent).updateRow(index, this.selectedProduct);
  }

  rowSelectHandler(args: RowSelectEventArgs): void {
    (this as any).selectedProduct = { ...args.data };
  }
}

export class Order {
  OrderID?: number;
  CustomerID?: string;
  Freight?: number;
  ShipCountry?: string;
}
