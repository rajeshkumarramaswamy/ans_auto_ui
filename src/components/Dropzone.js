import React from 'react';
import { Grid } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import {ExcelRenderer} from 'react-excel-renderer';
import CustomDropdown from './CustomDropdown';

class MyDropzone extends React.Component {
    constructor() {
        super();
        this.onDrop = (files) => {
            this.setState({ files })
        };
        this.state = {
            files: [],
            isOpen: false,
            dataLoaded: false,
            isFormInvalid: false,
            rows: null,
            cols: null
        };
    }


    fileHandler = (event) => {    
        if(event.target.files.length){
          let fileObj = event.target.files[0];
          let fileName = fileObj.name;
    
          //check for file extension and pass only if it is .xlsx and display error message otherwise
          if(fileName.slice(fileName.lastIndexOf('.')+1) === "xlsx"){
            this.setState({
              uploadedFileName: fileName,
              isFormInvalid: false
            });
            this.renderFile(fileObj)
          }    
          else{
            this.setState({
              isFormInvalid: true,
              uploadedFileName: ""
            })
          }
        }               
    }

    renderFile = (fileObj) => {
        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
          if(err){
            console.log(err);            
          }
          else{
            this.setState({
              dataLoaded: true,
              cols: resp.cols,
              rows: resp.rows
            });
          }
        }); 
    }


    render() {

        return (
            <>
                <Dropzone onDrop={this.onDrop}>
                    {({ getRootProps, getInputProps }) => (
                        <section className="container">
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input id='getInput' {...getInputProps()} onChange={this.fileHandler} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            </div>
                        </section>
                    )}
                </Dropzone>

                {this.state.dataLoaded &&
                <>
            <Grid centered style={{marginTop: '40px'}}>
            {/* <Card body outline color="secondary" className="restrict-card">
                
                <OutTable data={this.state.rows} columns={this.state.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
                
            </Card>   */}
            </Grid>

            <Grid centered style={{marginTop:'40px'}}>
                <CustomDropdown rows={this.state.rows}  />
            </Grid>
            </>
  
        }

            
            
            </>);
    }
}

export default MyDropzone;