import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import _ from 'lodash';


export class ScrollTableCtrl extends MetricsPanelCtrl {
    static templateUrl = 'partials/module.html';
    columns: any;
    records: any;
    serial: any[];
    intervals: any[];
    ts = 12;
    direction = [
        {
            id: "up",
            name: '向上',
        },
        {
            id: "down",
            name: '向下',
        },
    ];

    /** @ngInject */
    constructor($scope, $injector) {
        super($scope, $injector);

        this.intervals = [1000, 2000, 3000, 5000, 10000];

        this.events.on('render', this.onRender.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    }
    onRender() {
        this.onRefreshInterval();
    }
    onDataReceived(dataList) {
        this.columns = dataList[0].columns;
        this.records = dataList[0].rows;
        let numbers = new Array();
        for (let i = 0; i < this.columns.length; i++) {
            numbers.push(i);
        }
        this.serial = numbers;
        this.render();
    }
    onDataError() {
        this.render();
    }
    onRefreshInterval() {
        let i = this.$scope.ctrl.panel.scrollrefresh;
        // let d = this.$scope.crtrl.panel.scrolldirection;
        // let t = document.getElementById("gtlions") as HTMLInputElement;
        let t = document.getElementById("tbd");
        let change = function (table) {
            let row = table.insertRow(table.rows.length);
            for (let j = 0; j < table.rows[0].cells.length; j++) {
                let cell = row.insertCell(j);
                // cell.height = "24px";
                cell.innerHTML = table.rows[0].cells[j].innerHTML;
            }
            table.deleteRow(0);
        };
        setInterval(function () { change(t); }, i);

    }
    onInitEditMode() {
        this.addEditorTab('Options', 'public/plugins/grafana-scroll-table-panel/partials/options.html', 2);
    }
    // link(scope, elem) {
    //     this.events.on('render', () => {
    //         const $panelContainer = elem.find('.panel-container');

    //         if (this.panel.bgColor) {
    //             $panelContainer.css('background-color', this.panel.bgColor);
    //         } else {
    //             $panelContainer.css('background-color', '');
    //         }
    //     });
    // }
}






