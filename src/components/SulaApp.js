import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'moment/locale/ru';


import './App.css';
import logo from '../img/logo.png';
import logoFooter from '../img/logoFooter.png'

import List from './List';
import InfoCard from './InfoCard';
import Search from './Search';
import Form from './Form';
import PreView from './PreView';


//const url = 'https://dmitrykalko.github.io/rakovich/base/db.json';
const url = 'https://sula-gentry.herokuapp.com/api/lastnames';
let dataForSertificate = [];

class SulaApp extends React.Component {
  state = {
    base: [],
    selectedItem: null,
    search: '',
    intervalId: 0,
    formStatus: false,
    showStatus: false,
    fio: '',
    email: '',
    formData: '',
    date:'',
  }

  componentDidMount() {
    axios.get(`${url}`)
      .then(response => {
        const base = response.data;
        console.log(base);
        this.setState({ base: response.data });
      });
  };


  getSertificate = (selectedItem) => {
    const { lastName, flagName, imgId } = selectedItem;
    this.setState({ formStatus: true, lastName: lastName, flagName: flagName, imgId: imgId })
    this.selectingDate();
  }
  closeForm = (e) => {
    const { fio, email } = this.state;
    this.setState({ formStatus: false });
    this.setState({ fio: "" });
    this.setState({ email: "" });
    this.setState({ date: "" });
    let form = document.querySelector('.form');
    form.reset();
    this.selectingDate();
  }

  submitForm = (e) => {   
    const { fio, email } = this.state;
    e.preventDefault();
    this.setState({ formData: fio })
    this.makeStorage();
    this.makePostToServer();
   
    if (fio !== '' && email !== '') {
      Swal.fire({
        title: 'Поздравляем, Вы Шляхтич!',
        text: 'Ваша грамота Шляхтича отправлена на электронную почту',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      this.setState({ fio: "" });
      this.setState({ email: "" });
      this.setState({ date: "" });
      this.setState({ formStatus: false })
      e.target.reset();
      this.selectingDate();
    } else {
      Swal.fire({
        text: 'Пожалуйста, заполните все поля',
        icon: 'error',
        confirmButtonText: 'Понятно'
      })
    }
  }

  fioData = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  emailData = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  selectingDate = () => {
    let dateNow = moment().locale('ru').format('D MMMM YYYY');
    this.setState({ date: dateNow });
  }
  dateData = (day) => {
    let dateNow = moment(day).locale('ru').format('D MMMM YYYY')
    console.log(dateNow);
    this.setState({ date: dateNow });
  }
  preView = (e) => {
    e.preventDefault();
    const { fio, email } = this.state;
    if (fio !== '' && email !== '') {
      this.setState({ showStatus: true });
    } else {
      Swal.fire({
        text: 'Пожалуйста, заполните все поля',
        icon: 'error',
        confirmButtonText: 'Понятно'
      })
    }
  }
  preViewClose = () => {
    this.setState({ showStatus: false })
  }
  selectLastName = (id) => {
    const { base } = this.state;
    const copyBase = [...base];
    const selectedItemArr = copyBase.filter(item => item.id === id);
    const selectedItem = selectedItemArr[0];
    this.setState({ selectedItem });
    this.setState({ inputStatus: true })
    this.setState({ search: '' })
  }

  makeStorage = () => {
  
    const { fio } = this.state;
    const { selectedItem } = this.state;
    const { email } = this.state;

    dataForSertificate = JSON.parse(localStorage.getItem("dataForSertificate")) || [];
    if (fio !== '') {
      let emailObj = {email};
      dataForSertificate.push(fio, selectedItem, emailObj);
    }
    localStorage.setItem("dataForSertificate", JSON.stringify(dataForSertificate));
    console.log(dataForSertificate);
  }

  makePostToServer = () => {
    const { fio, selectedItem, email, date } = this.state;
  
    if (fio !== '') {
      let client = {
        fio: fio,
        id: selectedItem.id,
        lastName: selectedItem.lastName,
        flagName: selectedItem.flagName,
        imgId: selectedItem.imgId,
        date: date,
        email: email,
        status: false,
      };

    try {
      //const response = axios.post('http://localhost:5000/api/clients', client);
      const response = axios.post('https://sula-gentry.herokuapp.com/api/clients', client);
      console.log('👉 Returned data:', response);
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
    }
  }

  findLastName = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  fillterBase() {
    const { base, search } = this.state;

    let copyBase = [...base];

    if (search !== '') {
      copyBase = copyBase.filter(item => {
        if (item.lastName.toLowerCase().indexOf(search.toLowerCase()) === 0) {
          return item.lastName;
        }
      })
    }
    return copyBase;
  }

  render() {

    console.log(this.state);
    const base = this.fillterBase();

    return (
      <div className="wrapper">
        <main>
          <div className="App">
            <div className="backgroundImage"><img src={logo} alt="logo" className="logo" /></div>

            <div className="container">
              <Search
                onChange={this.findLastName}
                inputStatus={this.state.inputStatus}
                search={this.state.search}
              />

              <div className="cards">
                <div className="lastNames">
                  {base && (
                    <List
                      base={base}
                      onClick={this.selectLastName}
                      start={this.startInterval}
                    />
                  )}
                </div>
                <div>
                  {this.state.selectedItem && (
                    <InfoCard
                      selectedItem={this.state.selectedItem}
                      inputStatus={this.state.inputStatus}
                      search={this.state.search}
                      onClick={this.getSertificate}
                    />
                  )}
                </div>
              </div>
              <Form
                formStatus={this.state.formStatus}
                search={this.state.search}
                onClick={this.closeForm}
                onChangeFio={this.fioData}
                onChangeEmail={this.emailData}
                dateChanged={this.dateData}
                preView={this.preView}
                onSubmit={this.submitForm}
                date={this.state.date}
              />
              {this.state.selectedItem && (
                <PreView
                  selectedItem={this.state.selectedItem}
                  fio={this.state.fio}
                  date={this.state.date}
                  showStatus={this.state.showStatus}
                  onClick={this.preViewClose}
                  showStatus={this.state.showStatus}
                />
              )}
            </div>
          </div>
        </main>

        <footer>
          <div className="footer">
            <hr className="line" />
            <img src={logoFooter} alt="logoFoot" />
            <hr className="line" />
          </div>
        </footer>
      </div>

    );
  }
}

export default SulaApp;