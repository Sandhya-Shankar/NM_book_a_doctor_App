import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import { message } from "antd";
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';

const AddDocs = ({ userId }) => {

  const [docs, setDocs] = useState()
  const [alldocs, setAllDocs] = useState()
  const handleChange = (e) => {
    console.log(e.target.files[0])
    setDocs(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const formData = new FormData()
      formData.append('image', docs)

      const res = await axios.post(`http://localhost:8001/api/user/adddocs?userId=${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      if (res.data.success) {
        message.success(res.data.message)

      }
      else {
        message.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
      message.error('Something went wrong')
    }
  }

  const getAllDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/user/getdocsforuser', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { userId } // Pass userId as a query parameter
      });

      if (res.data.success) {
        setAllDocs(res.data.data);
      } else {
        alert('No docs');
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  const handleDownload = async (url, userId, index) => {
    try {
      const res = await axios.get('http://localhost:8001/api/user/getdocdownload', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId, index },
        responseType: 'blob'
      })
      if (res.data.success) {
        let urlCreator = window.URL || window.webkitURL;
        var downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        downloadLink.setAttribute("href", urlCreator.createObjectURL(new Blob([res.data
        ], { "type": "application/pdf" })));
        //set the file name here you want to give for your pdf
        downloadLink.setAttribute("download", "Document" + url + ".pdf");
        downloadLink.style.display = "none";
        downloadLink.click()
        alert("Your Document is Downloaded Successfully!")
      }
      else {
        message.error(res.data.error)
      }

    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }

  useEffect(() => {
    getAllDocuments();
  }, []);
  return (
    <div>
      <h2 className="p-3 text-center">Add Documents</h2>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label><b>Upload documents with Proper title:</b></Form.Label>
            <Form.Control accept="image/*" type="file" onChange={handleChange} required />
          </Form.Group>

          <Button type='submit'>
            Upload
          </Button>

        </Form>

        <Container className="my-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Image Name</th>
                <th>Image Url</th>
              </tr>
            </thead>
            <tbody>
              {alldocs?.length > 0 ? (
                alldocs.map((doc, i) => {
                  return (
                    <tr key={i}>
                      <td>{doc.name}</td>
                      <td>
                        <a onClick={() => handleDownload(doc.url, userId, i)} href={doc.url} rel="noopener noreferrer">
                          View
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={2}>
                    <Alert variant="info">
                      <Alert.Heading>No Documents to show</Alert.Heading>
                    </Alert>
                  </td>
                </tr>

              )}


            </tbody>
          </Table>
        </Container>

      </Container>
    </div>
  );
};

export default AddDocs;





