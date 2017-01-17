import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { FacebookAuth, Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { HomePage } from '../home/home';

import { Slides } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  showLogin:boolean = true;
  email:string = '';
  password:string = '';
  name:string = '';
  response = [];


  constructor(public navCtrl: NavController, public facebookAuth: FacebookAuth, public auth:Auth, public user: User, public alertCtrl: AlertController, public loadingCtrl:LoadingController, public http: Http) {
    this.http = http;
  }

  // Slider Start
  @ViewChild('mySlider') slider: Slides;
	goToSlide() {
    this.slider.slideTo(this.slider.getActiveIndex()+1, 500);
  }

  onSlideChanged() {
    let currentIndex = this.slider.getActiveIndex();
    console.log("Current index is", currentIndex);
  }

  slides = [
    {
      title: "Welcome to the Docs!",
      description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
      image: "assets/img/ica-slidebox-img-1.png",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "assets/img/ica-slidebox-img-2.png",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/img/ica-slidebox-img-3.png",
    }
  ];
  // Slider End

  ionViewDidLoad() {
    console.log('Hello LoginPage Page');
  }

  /*
  for both of these, if the right form is showing, process the form,
  otherwise show it
  */
	doFacebookLogin(){	

	  	let loader = this.loadingCtrl.create({
		    content: "Logging in..."
		});

	  	loader.present();

	  	this.facebookAuth.login().then( 
	  		(response) => {
	  			loader.dismissAll();
	  			var data = {
	                'username': this.user.social.facebook.data.full_name.replace(/\s/g,''),
	                'email': this.user.social.facebook.data.email,
	                'fullname': this.user.social.facebook.data.full_name,
	                'password': this.user.social.facebook.uid,
	                'is_fb': 1,
              	}

	            var link = 'http://www.marketmasterclass.com/api/authenticate/register';
	    		var par = JSON.stringify(data);
	    		let details: UserDetails = {'email':this.user.social.facebook.data.email, 'password':this.user.social.facebook.uid, 'name':this.user.social.facebook.data.full_name};

    		 	this.http.post(link, par).subscribe(response => {
		 		response = JSON.parse(response['_body']);
		 		if(response.status==1){
		 			this.auth.signup(details).then(() => {
				        console.log('ok signup');
				        this.auth.login('basic', {'email':details.email, 'password':details.password}).then(() => {
				          loader.dismissAll();
				          this.navCtrl.setRoot(HomePage);
				        });

				      }, (err:IDetailedError<string[]>) => {
				        
				        let errors = '';
				        for(let e of err.details) {
				          console.log(e);
				          if(e === 'conflict_email'){
				          		this.auth.login('basic', {'email':details.email, 'password':details.password}).then(() => {
						          this.navCtrl.setRoot(HomePage);
						        });
				          		errors = '';
				          		break;
					           // errors += 'A user with this email already exists.<br/>';
					       }
				          if(e === 'required_email') errors += 'Email is required.<br/>';
				          if(e === 'required_password') errors += 'Password is required.<br/>';
				          
				          //don't need to worry about conflict_username
				          if(e === 'invalid_email') errors += 'Your email address isn\'t valid.';
				        }
				        
				        if(errors.length){
					        let alert = this.alertCtrl.create({
					          title:'', 
					          subTitle:errors,
					          buttons:['OK']
					        });
					        alert.present();
					    }
				        loader.dismissAll();
				      });
		 		}else{
		 			 loader.dismissAll();
		 			let alert = this.alertCtrl.create({
			          title:'', 
			          subTitle:response['message'],
			          buttons:['OK']
			        });
			        alert.present();
		 		}
		 	}, error => {
		        loader.dismissAll();
		        let alert = this.alertCtrl.create({
		          title:'', 
		          subTitle:'Login failed!',
		          buttons:['OK']
		        });
		        alert.present();
		    });
		        // this.navCtrl.setRoot(HomePage);       
	  		}, (err) => {
	  			loader.dismissAll();
		        let alert = this.alertCtrl.create({
		          title:'', 
		          subTitle:'Login failed!',
		          buttons:['OK']
		        });
		        alert.present();
	  		}
	  	);
	}	

  doLogin() {
    if(this.showLogin) {
		console.log(this);
	    	
	    if(this.email === '' || this.password === '') {
	        let alert = this.alertCtrl.create({
	          title:'', 
	          subTitle:'All fields are rquired',
	          buttons:['OK']
	        });
	        alert.present();
	        return;
	    }    

	    let loader = this.loadingCtrl.create({
	        content: "Logging in..."
	    });

	    loader.present();

	    var link = 'http://www.marketmasterclass.com/api/authenticate';
	    var par = JSON.stringify({username: this.email, password: this.password});

	    this.http.post(link, par).subscribe(response => {
	     	response = JSON.parse(response['_body']);
	     	if(response.status == 1){
	     		var usr_email = response['details'].email;
     		  this.auth.login('basic', {'email':usr_email, 'password':this.password}).then(() => {
		        console.log('ok i guess?');
		        loader.dismissAll();
		        this.navCtrl.setRoot(HomePage);        
		      }, (err) => {
		      	if(err.response.unauthorized){
		      		let details: UserDetails = {'email':usr_email, 'password':this.password, 'name':this.email};
		      		this.auth.signup(details).then(() => {
				        console.log('ok signup');
				        this.auth.login('basic', {'email':details.email, 'password':details.password}).then(() => {
				          loader.dismissAll();
				          this.navCtrl.setRoot(HomePage);
				        });

				      }, (err:IDetailedError<string[]>) => {
				        loader.dismissAll();
				        let errors = '';
				        for(let e of err.details) {
				          console.log(e);
				          if(e === 'required_email') errors += 'Email is required.<br/>';
				          if(e === 'required_password') errors += 'Password is required.<br/>';
				          if(e === 'conflict_email') errors += 'A user with this email already exists.<br/>';
				          //don't need to worry about conflict_username
				          if(e === 'invalid_email') errors += 'Your email address isn\'t valid.';
				        }
				        let alert = this.alertCtrl.create({
				          title:'', 
				          subTitle:errors,
				          buttons:['OK']
				        });
				        alert.present();
				      });
		      	}else{
		        	loader.dismissAll();

			        let errors = '';
			        if(err.message === 'UNPROCESSABLE ENTITY') errors += 'Email isn\'t valid.<br/>';
			        if(err.message === 'UNAUTHORIZED') errors += 'Password is required.<br/>';

			        let alert = this.alertCtrl.create({
			          title:'', 
			          subTitle: err.message,
			          buttons:['OK']
			        });
			        alert.present();
			    }
		      });
	     	}else{
	     		loader.dismissAll();
	     		let alert = this.alertCtrl.create({
		          title:'', 
		          subTitle:response['message'],
		          buttons:['OK']
		        });
		        alert.present();
	     	}
	    }, error => {
	    	loader.dismissAll();
	        let alert = this.alertCtrl.create({
	          title:'', 
	          subTitle:'Login failed!',
	          buttons:['OK']
	        });
	        alert.present();
	    });
       
    } else {
      this.showLogin = true;
    }
  }


  doRegister() {


    if(!this.showLogin) {
      console.log('process register');

      /*
      do our own initial validation
      */
      if(this.name === '' || this.email === '' || this.password === '') {
        let alert = this.alertCtrl.create({
          title:'', 
          subTitle:'All fields are rquired',
          buttons:['OK']
        });
        alert.present();
        return;
      }

      var data = {
            'username': this.name.replace(/\s/g,''),
            'email': this.email,
            'fullname': this.name,
            'password': this.password,
            'is_fb': 0,
      	}

      var link = 'http://www.marketmasterclass.com/api/authenticate/register';
      var par = JSON.stringify(data);

      

      let loader = this.loadingCtrl.create({
        content: "Registering your account..."
      });
      loader.present();

      this.http.post(link, par).subscribe(response => {
	 		response = JSON.parse(response['_body']);
	 		console.log(response);
	 		if(response.status==1){
	 			let details: UserDetails = {'email':this.email, 'password':this.password, 'name':this.name};
	 			this.auth.signup(details).then(() => {
			        console.log('ok signup');
			        this.auth.login('basic', {'email':details.email, 'password':details.password}).then(() => {
			          loader.dismissAll();
			          this.navCtrl.setRoot(HomePage);
			        });

			      }, (err:IDetailedError<string[]>) => {
			        loader.dismissAll();
			        let errors = '';
			        for(let e of err.details) {
			          console.log(e);
			          if(e === 'required_email') errors += 'Email is required.<br/>';
			          if(e === 'required_password') errors += 'Password is required.<br/>';
			          if(e === 'conflict_email') errors += 'A user with this email already exists.<br/>';
			          //don't need to worry about conflict_username
			          if(e === 'invalid_email') errors += 'Your email address isn\'t valid.';
			        }
			        let alert = this.alertCtrl.create({
			          title:'', 
			          subTitle:errors,
			          buttons:['OK']
			        });
			        alert.present();
			      });
	 		}else{
	 			 loader.dismissAll();
	 			let alert = this.alertCtrl.create({
		          title:'', 
		          subTitle:response['message'],
		          buttons:['OK']
		        });
		        alert.present();
	 		}
	 	}, error => {
	         loader.dismissAll();
 			let alert = this.alertCtrl.create({
	          title:'', 
	          subTitle:'Registration failed!',
	          buttons:['OK']
	        });
	        alert.present();
	    });
    } else {
      this.showLogin = false;
    }
  }

}