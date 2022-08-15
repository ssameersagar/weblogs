import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ReactMde from "react-mde";
import {connect} from 'react-redux';
import {addPost} from '../../actions/post';
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

const PostForm = ({addPost}) => {
    let [text, setText] = useState('');
    const [selectedTab, setSelectedTab] = useState("write");


    return (
        <div class="post-form">
        <div class="bg-primary p">
          <h3>Say Something...</h3>
        </div>

                
        <form class="form my-1" onSubmit={e => {
            e.preventDefault();
            // text= text.split("/n").join("<br>");
            text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
            addPost({text});
            setText('');
        }}>
          <ReactMde
        value={text}
        onChange={setText}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={markdown =>
          Promise.resolve(converter.makeHtml(markdown.replace(/(?:\r\n|\r|\n)/g, '<br>')))
        }
      />
        
           
          {/* <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Create a post"
            value={text}
            onChange={e => setText(e.target.value)}
            required
          ></textarea> */}
          <input type="submit" class="btn btn-dark my-1" value="Submit" />

        </form>
      </div>
    )
}

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired,
}

export default connect(null, {addPost})(PostForm)
