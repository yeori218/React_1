import React, { Component } from 'react';
import TOC from './components/TOC';
import ReadContent from './components/ReadContent';
import Subject from './components/Subject';
import Control from './components/Control';
import CreateContent from './components/CreateContent';
import UpdateContent from './components/UpdateContent';
import './pure.css';

class Pure extends Component {
    constructor(props){
        super(props);
        this.max_content_id = 4;
        this.state = {
            mode:'welcome',
            welcome:{title:'Welcome', desc:'Hello, React.'},
            subject:{title:'WEB', subtitle:'World Wide Web'},
            contents:[
                {id:1, title:'HTML', desc:'HTML is for information'},
                {id:2, title:'CSS', desc:'CSS is for design'},
                {id:3, title:'JavaScript', desc:'JavaScript is for interactive'},
                {id:4, title:'React', desc:'React is for '}
            ]
        }
    }
    getReadContent(){
      var i = 0;
        while(i < this.state.contents.length){
            var data = this.state.contents[i];
            if(data.id === this.state.selected_content_id){
              return data;
            }
            i++;
        }
    }
    getContent(){
      var _title, _desc, _article = null;
      if(this.state.mode === 'welcome'){
        _title = this.state.welcome.title;
        _desc = this.state.welcome.desc;
        _article = <ReadContent title={_title} desc={_desc}></ReadContent>
      } else if(this.state.mode === 'read'){
        var _content = this.getReadContent();
        _article = <ReadContent title={_content.title} desc={_content.desc}></ReadContent>
      } else if(this.state.mode === 'create'){
        _article = <CreateContent 
          onSubmit={function(_title, _desc){
            this.max_content_id = this.max_content_id + 1;
            // push // push 단독 사용 시 원본도 변하기때문에 사용 주의
            // this.state.contents.push(
            //   {id:this.max_content_id, title:_title, desc:_desc}
            // );
            // concat // concat 사용 시 원본에 영향 X
            // var _contents = this.state.contents.concat(
            //   {id:this.max_content_id, title:_title, desc:_desc}
            // );
            // push + Array.from // push를 쓴다면 Array.form를 사용해줘야 함 (원본에 영향 X) -> 객체는 Object.assign
            var _contents = Array.from(this.state.contents);
            _contents.push({id:this.max_content_id, title:_title, desc:_desc});
            this.setState({
              contents:_contents,
              mode:'read',
              selected_content_id:this.max_content_id
            });
          }.bind(this)}
        ></CreateContent>
      } else if(this.state.mode === 'update'){
            _content = this.getReadContent();
            _article = <UpdateContent 
            data = {_content}
            onSubmit={function(_id, _title, _desc){
            var _contents = Array.from(this.state.contents);
            var i = 0;
            while(i < _contents.length){
              if(_contents[i].id === _id){
                _contents[i] = {id:_id, title:_title, desc:_desc};
                break;
              }
              i++;
            }
            this.setState({
              contents:_contents,
              mode:'read'
            });
          }.bind(this)}
        ></UpdateContent>
      }
      return _article;
    }
  render (){
    return(
      <div className="Pure">
          <Subject 
            title={this.state.subject.title} 
            subtitle={this.state.subject.subtitle}
            onChangePage={function(){
              this.setState({mode:'welcome'});
            }.bind(this)}
            >
          </Subject>
          <TOC 
            data={this.state.contents}
            onChangePage={function(id){
              this.setState({
                mode:'read',
                selected_content_id:Number(id)
              });
            }.bind(this)}
          > 
          </TOC>
          <Control
          onChangeMode={function(_mode){
            if(_mode === 'delete'){
              if(window.confirm('really?')){
                var _contents = Array.from(this.state.contents);
                var i = 0;
                while(i < _contents.length){
                  if(_contents[i].id === this.state.selected_content_id){
                    _contents.splice(i,1);
                    break;
                  }
                  i++;
                }
                this.setState({
                  mode:'welcome',
                  contents:_contents
                });
                alert('deleted!');
              }
            } else {
              this.setState({
                mode:_mode
              });
            }
            
          
          }.bind(this)}>
          </Control>
          {this.getContent()}
      </div>
    );
  }
}

export default Pure;
