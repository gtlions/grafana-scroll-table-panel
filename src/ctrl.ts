import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import _ from 'lodash';

export class ScrollTableCtrl extends MetricsPanelCtrl {
    static templateUrl = 'partials/module.html';
    columns: any;
    records: any;
    serial: any[];
    intervals: any[];
    tabID: any;
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
        let timeOut = this.getDashBoardrefreshInterval();

        // let refreshInterval = this.$scope.ctrl.panel.scrollrefresh;
        // if (refreshInterval == '' || refreshInterval == undefined || refreshInterval == null) {
        //     refreshInterval = 2000;
        // }
        // this.tabID = this.$scope.ctrl.panel.tabID;
        // let tid = this.$scope.$id;

        let tabElements = document.getElementsByName("tab");
        for (let tabElement of tabElements) {
            let id = setInterval(function () { changeTabRows(tabElement); }, 2500);
            setTimeout(function () {
                clearInterval(id);
            }, timeOut);

        }


        let changeTabRows = function (table) {
            let row = table.insertRow(table.rows.length);
            for (let j = 0; j < table.rows[0].cells.length; j++) {
                let cell = row.insertCell(j);
                cell.innerHTML = table.rows[0].cells[j].innerHTML;
            }
            table.deleteRow(0);
        };

    }
    onInitEditMode() {
        // this.addEditorTab('Options', 'public/plugins/grafana-scroll-table-panel/partials/options.html', 2);
    }
    getDashBoardrefreshInterval() {
        let refresh = 99999999999;
        let str = this.$scope.$parent.dashboard.refresh;
        if (str == '' || str == undefined || str == null) {
        } else {
            if (str.indexOf('s') > 0) {
                let v = str.substr(0, str.indexOf('s'));
                refresh = v * 1000;
            } else if (str.indexOf('m') > 0) {
                let v = str.substr(0, str.indexOf('m'));
                refresh = v * 1000 * 60;
            } else if (str.indexOf('h') > 0) {
                let v = str.substr(0, str.indexOf('h'));
                refresh = v * 1000 * 3600;
            } else if (str.indexOf('d') > 0) {
                let v = str.substr(0, str.indexOf('d'));
                refresh = v * 1000 * 3600 * 24;
            }
        }
        return refresh;

    }
    guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}






