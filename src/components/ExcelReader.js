import React, { Component } from 'react';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import CustomDropdown from './CustomDropdown';
import {
  Button,
  Grid,
  Tab,
  Message,
  Form,
  Icon,
  Divider,
} from "semantic-ui-react";
import _ from 'lodash';

class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
      filename: '',
      showForm: true,
      showError: false
    }
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ showForm: true, showError: false });
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0], filename: files[0].name });
  };

  handleFile() {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      if (!_.isEmpty(_.takeWhile(data, 'Module'))) {
        this.setState({ data: data, showForm: false,cols: make_cols(ws['!ref']) }, () => {
          console.log(JSON.stringify(this.state.data, null, 2));
        });
      } else {
        this.setState({showError: true})
      }

    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    };
  }

  handleRefresh = () => {
    this.setState({showForm: true, data: []})
  }

  render() {

    return (
      <>
      { !this.state.showError ?
      <>
      { _.isEmpty(this.state.data) && this.state.showForm ?
      <Tab.Pane attached={false} className="center-div">
            <Message>Upload files to convert Excel data to YAML or JSON.</Message>
            <Form onSubmit={this.onFormSubmit}>
              <Form.Field>
                <label>File input & upload </label>
                <Button as="label" htmlFor="file" type="button" animated="fade">
                  <Button.Content visible>
                    <Icon name="file" />
                  </Button.Content>
                  <Button.Content hidden>Choose a File</Button.Content>
                </Button>
                <input
                  type="file"
                  id="file"
                  hidden
                  accept={SheetJSFT}
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  label="File Chosen: "
                  placeholder="Use the above bar to browse your file system"
                  readOnly
                  value={this.state.filename}
                />
                <Button style={{ marginTop: "20px" }} type="submit" onClick={this.handleFile}>
                  Process
                </Button>
              </Form.Field>
            </Form>
          </Tab.Pane>: null
      }
        { !_.isEmpty(this.state.data) &&
        <Tab.Pane attached={false} className='center-div'>
        <Grid style={{ marginTop: '40px' }}>
          <CustomDropdown data={this.state.data} refresh={this.handleRefresh} />
        </Grid>
        </Tab.Pane>
        }
      </>
      : <div>Error</div>
      }
      </>
    )
  }
}

export default ExcelReader;