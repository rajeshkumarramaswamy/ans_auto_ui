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
  Header, Segment, TransitionablePortal
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
      hideForm: false,
      showError: false,
      disableButton: true
    }
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ hideForm: false, showError: false });
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0], filename: files[0].name, disableButton: false });
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
        this.setState({ data: data, hideForm: true, cols: make_cols(ws['!ref']) }, () => {
          // console.log(JSON.stringify(this.state.data, null, 2));
        });
      } else {
        this.setState({ showError: true, disableButton: true })
        return false;
      }

    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    };
  }

  handleRefresh = () => {
    this.setState({ hideForm: false, data: [], disableButton: true })
  }

  handleClose = () => this.setState({ showError: false, disableButton: true })

  render() {
    return (
      <>
        <Tab.Pane attached={false} className="center-div" style={{ display: !_.isEmpty(this.state.data) && this.state.hideForm ? 'None' : 'block' }}>
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
              <Button primary style={{ marginTop: "20px" }} type="submit" onClick={this.handleFile} disabled={this.state.disableButton}>
                Process
                </Button>
            </Form.Field>
          </Form>
          <TransitionablePortal onClose={this.handleClose} open={this.state.showError}>
            <Segment style={{ position: 'inherit', top: '40%', zIndex: 1000 }} color='red' inverted>
              <Header>Unsupported file format or columns in sheet</Header>
              <p>Make sure the columns are Module, Parameters and Choices</p>
              <p>Click any where to continue..!</p>
            </Segment>
            {/* <Button
                content='Close Portal'
                // negative
                onClick={this.handleClose}
              /> */}
          </TransitionablePortal>
        </Tab.Pane>

        {!_.isEmpty(this.state.data) &&
          <Tab.Pane attached={false} className='center-div'>
            <Grid>
              <CustomDropdown data={this.state.data} refresh={this.handleRefresh} />
            </Grid>
          </Tab.Pane>
        }
      </>
    )
  }
}

export default ExcelReader;