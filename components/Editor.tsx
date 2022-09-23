import React from "react";

import { Editor } from "@tinymce/tinymce-react";

const init = {
  menubar: false,
  statusbar: false,
  plugins: "lists emoticons",
  toolbar: "undo redo | styleselect | bold italic | " + "numlist bullist | emoticons",
  branding: false,
};

const MyEditor = (props) => (
  <Editor apiKey={process.env.TINYMCE_API_KEY} init={init} onE {...props} />
);

export default MyEditor;
