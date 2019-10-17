import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Globals } from '../globals';
import { LoginService } from './login.service';
import { User } from '../user';
import { ConditionalExpr } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent implements OnInit {

  private user: string;
  private user_password: string;
  success = false;
  error = false;
  tmpdivHtml: SafeHtml;
  parsedCsrfInputTag: any;

  @ViewChild("tmpdiv",{static: true}) tmpdiv: ElementRef;


  constructor(private router: Router, public globals: Globals,
              private service: LoginService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {

  }

  getUserInfo (csrftoken: string) {
    this.service.getUser(this.user,this.user_password, csrftoken).subscribe(
      result => {
        this.globals.actual_user = new User();
        this.globals.actual_user.id = result.id;
        this.globals.actual_user.name = result.first_name+' '+result.last_name;
        this.globals.actual_user.mail = result.email;
        this.globals.actual_user.projects = {};
        this.service.getProjects().subscribe(
          result2 => {
            for (const projects of result2) {
              this.globals.actual_user.projects[projects.name] = projects.id;
            }
            setTimeout(() => {
              this.router.navigate(['/main']);
            },
            1000);
          },
          error => {
            alert('Error getting user projects.');
          }
        );
      },
      error => {
        if (error.status === 401) {
          alert('Invalid username or password.');
        } else {
          alert('Cannot login.');
        }
        
      },
      () => {
        this.user_password = '';
      }
    );
  }

/**
 * This function retrieves the csrftoken from the HTML input tag.
 * 
 */
  getChildRecursion(elementRef : ElementRef) : void {
    
    const node = elementRef.nativeElement;
    let child = node.firstChild;
    if (child == null){
      this.getChild(elementRef);
    } else {
      let csrftoken : string;
      if (child.getAttribute('name') === this.globals.csrftoken_form_input_name) {
        csrftoken = child.getAttribute('value');
      } else {
        csrftoken = null;
      }
      this.getUserInfo(csrftoken);
    }
  }

  /**
   * This function is used for creating a recursive delay to wait for the DOM to update
   * Replace by a Promise when its compatibility is no longer an issue
   * @param elementRef 
   */

  getChild(elementRef : ElementRef) : void {
    setTimeout( () => {
      this.getChildRecursion(elementRef);
    }, 1000);
    
    
  }
  
  
  /**
  *  Creates a ElementRef by parsing a string in HTML
  *  and returns the first HTML tag DOM element as an ElementRef
  *  by inserting html into "this.tmpdivHtml". This last one is
  *  an HTML tag of this component bound to the "tmpdivHtml" property of this component. 
  *  Notice that the inner HTML of the HTML tag will be replaced by htmlText.
  *  Then, calls getUserInfo().  
  */
  DOMHtmlTagParserAndGetUserInfo ( elementRef : ElementRef , htmlText : string) : any {
    this.tmpdivHtml = this.sanitizer.bypassSecurityTrustHtml(htmlText);
    const child = this.getChild(elementRef);
    return child;

  }

  login() {
    this.error = false;
    const newLocal = this.success = false;
    this.service.getUserCSRFToken().subscribe(csrf => {
      this.DOMHtmlTagParserAndGetUserInfo(this.tmpdiv, csrf);
    
    },
      error => {
          alert("Cannot retrieve CSRF token.");
          return;
    })


  }
}
