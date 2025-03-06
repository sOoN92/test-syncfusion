import { inject, NgModule, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import {
  GridModule,
  EditService,
  ToolbarService,
  SortService,
  PageService,
} from "@syncfusion/ej2-angular-grids";
import {
  DropDownListComponent,
  DropDownListModule,
} from "@syncfusion/ej2-angular-dropdowns";
import {
  TextBoxModule,
  NumericTextBoxAllModule,
} from "@syncfusion/ej2-angular-inputs";
import { Component, ViewChild } from "@angular/core";
import { ButtonModule } from "@syncfusion/ej2-angular-buttons";
import {
  GridComponent,
  RowSelectEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { data } from "./datasource";
import { DialogComponent, DialogModule } from "@syncfusion/ej2-angular-popups";
import { MySerService } from "./my-ser.service";
import { HttpClientModule } from "@angular/common/http";

@Component({
  imports: [
    GridModule,
    FormsModule,
    TextBoxModule,
    ButtonModule,
    NumericTextBoxAllModule,
    DropDownListModule,
    DialogModule,
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
  selector: "app-root",
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public orders: Object[] = data;
  myser = inject(MySerService);
  @ViewChild("grid") public grid?: GridComponent;
  public dropdown$ = this.myser.getAll();
  public dropdown: any = [];
  public selectedProduct: Order = new Order();
  public dropdownFields: Object = { text: "shipCountry", value: "shipCountry" };
  public editSettings: Object = { allowEditing: true };

  @ViewChild("ddlelement")
  public dropDownListObject = DropDownListComponent;

  @ViewChild("ejDialog") ejDialog: DialogComponent | undefined;

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
