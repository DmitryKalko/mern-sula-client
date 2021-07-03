import React from 'react';
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import moment from 'moment';
import 'moment/locale/ru';

import Fio from './Fio';
import AdminSearch from './AdminSearch';
import PdfToPrint from './PdfToPrint';
import './App.css';

let dataForSertificate = JSON.parse(localStorage.getItem("dataForSertificate")) || [];
let printedFios = [];
printedFios = JSON.parse(localStorage.getItem("printedFios")) || [];

let autoClearingStatus;


class Sertificates extends React.Component {
  state = {
    fio: '',
    selectedItem: '',
    date: '',
    autoClearingStatus: false,
    adminSearch: '',
    applications: [],
  }

  componentWillMount() {
    this.autoCleanCheck();
    console.log(localStorage);

    let applications = dataForSertificate.filter(item => typeof item === 'string');
    this.setState({ applications: applications })
  }

  isSelecting = (fio) => {
    let indexOfElement = dataForSertificate.indexOf(fio);
    this.setState({ selectedItem: dataForSertificate[indexOfElement + 1] });
    this.setState({ selectedItem: { ...dataForSertificate[indexOfElement + 1], selectFio: fio } })
    this.setState({ fio: fio });
    this.selectingDate();
  }
  clearListNow = () => {
    localStorage.clear();
    window.location.reload();
  }


  autoCleanCheck = () => {
    autoClearingStatus = JSON.parse(localStorage.getItem("autoClearingStatus"));
    console.log(autoClearingStatus)
    if (autoClearingStatus === true) {
      this.autoClearList();
    }
  }
  autoClearList = () => {
    let { autoClearingStatus } = this.state;
    if (autoClearingStatus === false) {
      autoClearingStatus = true;
      localStorage.setItem("autoClearingStatus", JSON.stringify(autoClearingStatus));
      this.setState({ autoClearingStatus: true })
      let intervalId = setInterval(() => {
        this.clearInTime();
      }, 50000);
      localStorage.setItem("intervalId", JSON.stringify(intervalId));
      console.log('процесс пошел!');
      console.log(localStorage);
    }
    else {
      let autoClearingStatus = false;
      localStorage.setItem("autoClearingStatus", JSON.stringify(autoClearingStatus));
      localStorage.removeItem('intervalId');
      this.setState({ autoClearingStatus: false });
      console.log('процесс заглох');
      console.log(localStorage);
      console.log(autoClearingStatus);
    }
  }
  clearInTime = () => {
    let date = new Date;
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (hours === 0 && minutes === 0) {
      this.clearList();
    }
  }
  clearList = () => {
    localStorage.removeItem('dataForSertificate');
    localStorage.removeItem('printedFios');
    window.location.reload();
  }


  selectingDate = () => {
    let dateNow = moment().locale('ru').format('DD MMMM YYYY');
    this.setState({ date: dateNow });
  }
  changeDate = (e) => {
    const { value } = e.target;
    let dateNow = moment(value).locale('ru').format('D MMMM YYYY');
    this.setState({ date: dateNow });
  }
  alreadyPrinted = (handlePrint, fio) => {
    handlePrint();
    if (fio !== '') {
      printedFios.push(fio);
    }
    localStorage.setItem("printedFios", JSON.stringify(printedFios));
    console.log(printedFios);
  }
  findApplication = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  fillterApplications() {
    const { adminSearch, applications } = this.state;

    let copyApplications = [...applications];
    if (adminSearch !== '') {
      copyApplications = copyApplications.filter(item => {
        if (item.toLowerCase().indexOf(adminSearch.toLowerCase()) === 0) {
          return item;
        }
      })
    }
    return copyApplications;
  }


  render() {
    //console.log(localStorage);
    console.log(this.state);
    const applications = this.fillterApplications();

    const fios = applications.map(fio => (
      <Fio
        key={fio}
        fio={fio}
        onClick={this.isSelecting}
        selectedItem={this.state.selectedItem}
      />
    ))

    return (
      <div className='adminPage'>

        <ul className="sertificate">
          {fios}
        </ul>

        <div className='functional'>

          <AdminSearch
            onChange={this.findApplication}
            adminSearch={this.state.adminSearch}
          />

          <ReactToPrint
            content={() => this.componentRef}>

            <PrintContextConsumer>
              {({ handlePrint }) => (
                <button
                  className='print'
                  onClick={() => this.alreadyPrinted(handlePrint, this.state.fio)}
                >
                  Печать
                </button>
              )}
            </PrintContextConsumer>
          </ReactToPrint>

          <input type="date" name="date" className="calendar" onChange={this.changeDate} />

          <div className='cleanering'>
            <button
              className='clear' onClick={this.clearListNow}>Очистить список</button>
            <button
              className='autoclear'
              style={this.state.autoClearingStatus === true ? { backgroundColor: 'lime' } : { backgroundColor: 'white' }}
              onClick={this.autoClearList}
            >
              Очищать автоматически в 00:00
            </button>
          </div>

          <div className='pdfToPrint'>
            <PdfToPrint
              ref={el => (this.componentRef = el)}
              fio={this.state.fio}
              date={this.state.date}
              selectedItem={this.state.selectedItem}
            />
          </div>
        </div>

      </div>
    );
  }
}
export default Sertificates;