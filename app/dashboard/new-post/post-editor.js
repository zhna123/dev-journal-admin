import { useController } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message"
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from "react";

export default function PostEditor({ control, name, errors }) {

  const editorRef = useRef(null);
  // const log = () => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };

  const { field } = useController({
    name,
    control,
    rules: { required: "This field is required" },
  });

  const { onChange, ref, ...rest } = field;

  return (
    <>
      <Editor 
        apiKey='3nqpeohghq95uosftsn57872cn0v2ey6vb5j0g1x42n2fhgi'
        onInit={(evt, editor) => {
          editorRef.current = editor  // shared ref
          ref(editor)
        }}
        // initialValue="<p>Write something...</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } '
          }}
          {...rest}
          onEditorChange={onChange}
      />
      <ErrorMessage
        errors = {errors}
        name="content"
        render={({ message }) => <p className="text-red-600">{message}</p>}
      />
    </>
  )

}