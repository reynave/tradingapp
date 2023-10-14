import { Component, Input, OnChanges, OnInit } from '@angular/core'; // First, import Input
//import { DetailInterface } from 'src/app/board/table/table-interface';
import { NgbProgressbarConfig, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'; 
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-widget-table-summary',
  templateUrl: './widget-table-summary.component.html',
  styleUrls: ['./widget-table-summary.component.css']
})
export class WidgetTableSummaryComponent implements OnInit, OnChanges { 
  accumulationBalance :number = 100;
  sum = {
    row: 0,
    profit: 0,
    win: 0,
    loss: 0,
    bestProfit: 0,
    worstLoss: 0, 
    tradingTime: 0,
  }
  avg = {
    profit: 0,
    winRate: 0,
    consecutiveWin: 0,
    consecutiveLoss: 0,
    tradingTime: 0,
    fasterTradingTime: 9999999,
    longestTradingTime: 0,
  }
  @Input() detail: any;
  @Input() startBalance: number = 0;
  constructor(config: NgbProgressbarConfig) {
		// customize default values of progress bars used by this component tree
		config.max = 100;
		config.striped = true;
		config.animated = true; 
		config.height = '24px';
	}
  ngOnInit(): void {
    this.reset();
    this.fnCalculation();
    // console.log(this.detail);
  }
  reset(){
    this.sum = {
      row: 0,
      profit: 0,
      win: 0,
      loss: 0,
      bestProfit: 0,
      worstLoss: 0, 
      tradingTime: 0,
    }
    this.avg = {
      profit: 0,
      winRate: 0,
      consecutiveWin: 0,
      consecutiveLoss: 0,
      tradingTime: 0,
      fasterTradingTime: 9999999,
      longestTradingTime: 0,
    }
  }

  ngOnChanges() { 
    this.reset();
    this.fnCalculation();
  }
  growthBalance : number = 100;
  fnCalculation() {

    let profit = 0;
    let isNotNan = 0;
    let tempWin = 0;
    let tempLoss = 0;
    let a: string, b: string, dateA: any, dateB: any;
    let totalTime: number = 0;
    let timeDifference: number = 0;
    this.sum.row = this.detail.length;
    for (let i = 0; i < this.detail.length; i++) {
      
      profit = parseInt(this.detail[i]['f11']);
      a = this.detail[i]['f1'] + " " + this.detail[i]['f2'] + ":00";
      b = this.detail[i]['f8'] + " " + this.detail[i]['f9'] + ":00";
 
      this.sum.profit += !Number.isNaN(profit) ? profit : 0;
      if (profit > 0) this.sum.win++;
      else if(profit < 0)   { this.sum.loss++; }

      if (profit >= this.sum.bestProfit) this.sum.bestProfit = profit;
      if (profit <= this.sum.worstLoss) this.sum.worstLoss = profit;

      if (profit > 0) { tempWin++ }
      else { tempWin = 0; }
      if (tempWin > this.avg.consecutiveWin) this.avg.consecutiveWin = tempWin;

      if (profit < 0) { tempLoss++ }
      else { tempLoss = 0; }
      if (tempLoss > this.avg.consecutiveLoss) this.avg.consecutiveLoss = tempLoss;

      if (this.detail[i]['f1'] != "" && this.detail[i]['f8'] != "") {
    //    console.log("f1:",this.detail[i]['f1']," f8:",this.detail[i]['f8'])
        dateA = new Date(a);
        dateB = new Date(b);
        timeDifference = dateB - dateA;
        totalTime = timeDifference / (1000 * 60 * 60);
        this.sum.tradingTime += !Number.isNaN(parseInt(totalTime.toString())) ? parseInt(totalTime.toString()) : 0;

        if (!Number.isNaN(parseInt(totalTime.toString()))) isNotNan++;
        if (!Number.isNaN(totalTime) && (totalTime <= this.avg.fasterTradingTime)) {
          this.avg.fasterTradingTime = Math.floor(totalTime);
        }
      }else{

      //  console.log("f1: null" ); 
      }


      if (!Number.isNaN(totalTime) && (totalTime >= this.avg.longestTradingTime)) {
        this.avg.longestTradingTime = Math.floor(totalTime)
      }

    }
   
    this.avg.tradingTime = Math.floor(this.sum.tradingTime / isNotNan);
    this.avg.profit = this.sum.profit / this.sum.row;
    this.avg.winRate = ((this.sum.win / this.sum.row) * 100 );

   // this.startBalance 
    if((this.startBalance + this.sum.profit) < this.startBalance){
      this.accumulationBalance  = Math.round(((this.startBalance + this.sum.profit) / this.startBalance) * 100);
    }else{
      this.accumulationBalance = Math.round(((this.startBalance + this.sum.profit) / this.startBalance ) * 100) ;
      //this.gr
    }
    this.avg.fasterTradingTime = this.avg.fasterTradingTime == 9999999 ? NaN :this.avg.fasterTradingTime ; 
   
  }

  fnColorProgress(val : number){
    let color = "danger";
    if(val > 100){
      color = "primary";
    } 

    if(val <= 100){
      color = "success";
    }
    if(val <= 50){
      color = "warning";
    }
    if(val < 40){
      color = "danger";
    }
    return color;
  }
}
