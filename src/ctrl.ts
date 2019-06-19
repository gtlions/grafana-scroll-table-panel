import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import _ from 'lodash';

export class ScrollTableCtrl extends MetricsPanelCtrl {
    static templateUrl = 'partials/module.html';
    columns: any;
    records: any;
    serial: any[];
    intervals: any[];
    tabID: any;
    panelID: any;
    idInterval: any;
    table: any;
    /** @ngInject */
    constructor($scope, $injector) {
        super($scope, $injector);
        this.intervals = [1000, 2000, 3000, 5000, 10000];
        this.panelID = this.$scope.$id;
        this.events.on('render', this.onRender.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.table = document.getElementById("tabAutoSrolle");
    }

    onRender() {
        this.panelAutoSrolle();
    }

    onDataReceived(dataList) {
        let tabElement = document.getElementById("tabAutoSrolle");
        this.delTabRows(tabElement);
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

    panelAutoSrolle() {
        let dashBoardRefreshInterval = this.getDashBoardRefreshInterval();
        let panelRefreshInterval = this.$scope.ctrl.panel.scrollrefresh;
        if (panelRefreshInterval == '' || panelRefreshInterval == undefined || panelRefreshInterval == null) {
            panelRefreshInterval = 2000;
        }

        let tabElement = document.getElementById("tabAutoSrolle");
        clearInterval(this.idInterval);
        this.idInterval = setInterval(function () { changeTabRows(tabElement); }, panelRefreshInterval);
        setTimeout(function () {
            clearInterval(this.idInterval);
            // clearTabRows(tabElement);
        }, dashBoardRefreshInterval - 500);

        let changeTabRows = function (table) {
            var myDate = new Date();
            console.log('into changeTabRows ' + myDate.getMinutes() + ':' + myDate.getSeconds() + '.' + myDate.getMilliseconds());
            // console.log(table.rows.length);
            let row = table.insertRow(table.rows.length);
            for (let j = 0; j < table.rows[0].cells.length; j++) {
                let cell = row.insertCell(j);
                cell.innerHTML = table.rows[0].cells[j].innerHTML;
            }
            table.deleteRow(0);
        }

        let clearTabRows = function (table) {
            var rowNum = table.rows.length;
            for (let i = 0; i < rowNum; i++) {
                table.deleteRow(i);
                rowNum = rowNum - 1;
                i = i - 1;
            }
        }
    }

    onInitEditMode() {
        this.addEditorTab('Options', 'public/plugins/grafana-scroll-table-panel/partials/options.html', 2);
    }

    delTabRows(table) {
        var rowNum = table.rows.length;
        for (let i = 0; i < rowNum; i++) {
            table.deleteRow(i);
            rowNum = rowNum - 1;
            i = i - 1;
        }
    }

    getDashBoardRefreshInterval() {
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
}






