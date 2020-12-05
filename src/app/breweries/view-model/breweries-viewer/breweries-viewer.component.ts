import {Component, OnInit, Input} from '@angular/core';
import {Breweries} from '../../breweries.model';

@Component({
  selector: 'app-breweries-viewer',
  templateUrl: './breweries-viewer.component.html',
  styleUrls: ['./breweries-viewer.component.scss'],
})
export class BreweriesViewerComponent implements OnInit {

  @Input() public item?: Breweries;

  constructor() { }

  ngOnInit() {
  }

}
