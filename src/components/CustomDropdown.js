import React, { Component } from 'react';
import { Dropdown, Button, Grid, TextArea, Input } from "semantic-ui-react";
import _ from 'lodash';
import YAML from 'json-to-pretty-yaml';
import {yamprint} from 'yamprint';
import yaml from 'yamljs';


class CustomDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dp1: false,
            dp2: false,
            dp3: false,
            mypackage:'',
            description:'',
            dataObject: [],
            sampleData: [
                {
                  "name": "Download the nginx package but do not install it",
                  "yum": {
                    "name": [
                      "nginx",
                      "postgresql",
                      "postgresql-server"
                    ],
                    "state": "latest",
                    "download_only": true
                  }
                },
                {
                  "name": "Update the repository cache and update package \"nginx\" to latest version using default release squeeze-backport",
                  "apt": {
                    "name": "nginx",
                    "state": "latest"
                  }
                }
              ],
            // yamlText: ''
        }
    }

    handleChangefordp1 = (e, { value }) => this.setState({ dp1: value })
    handleChangefordp2 = (e, { value }) => this.setState({ dp2: value })
    handleChangefordp3 = (e, { value }) => this.setState({ dp3: value })
    handleTextChange = (e) => this.setState({[e.target.name]: e.target.value})

    onAddItem = () => {
        // not allowed AND not working
        let sample1 = {
            'name': this.state.description,
            [this.state.dp1]: {
                'name': this.state.mypackage.split(','),
                [this.state.dp2]: this.state.dp3
            }
        }
        this.setState(state => {
            const list = state.dataObject.push(sample1);
            return list
        });
        // const list = this.state.dataObject.push(sample1)

        // this.setState({  yamlText: YAML.stringify(this.state.dataObject.push(sample1)) })

        
    };

    textAreaChange = (e) => {
        e.preventDefault()
        this.setState({ dataObject: YAML.stringify((this.state.dataObject)) })
    }

    refreshTextArea = () => {
        this.setState({dataObject: []})
    }

    render() {
        const { data } = this.props
        const { dp1, dp2, dp3, dataObject, description, mypackage, sampleData } = this.state
        let dropdown1 = _.map(_.uniq(_.map(data, x => x['Module'])), (val) => ({ 'key': val, 'value': val, 'text': val }))
        let dropdown2 = _.map(_.uniq(_.map(data, x => x['Parameters'])), (val) => ({ 'key': val, 'value': val, 'text': val }))
        let dropdown3 = _.map(_.uniq(_.map(data, x => x['Choices'])), (val) => ({ 'key': val, 'value': val, 'text': val }))
        let yamlText = dataObject ? YAML.stringify(dataObject) : null
        // let yamlText = dataObject ? YAML.stringify(sampleData) : null
        // let yamlTextA = dataObject ? yamprint(dataObject) : null
        console.log('yamlText', dataObject, sampleData);
        return (
            <Grid.Row columns={2} style={{marginLeft: '100px'}}>
                {!_.isEmpty(data) ?
                    <Grid  divider columns={2} width={6}>
                        <Grid.Row>
                        <Input value={description} onChange={this.handleTextChange} name='description' />
                        </Grid.Row>
                        <Grid.Row textAlign='center'>
                            <Dropdown
                                placeholder="Module"
                                selection
                                options={dropdown1}
                                onChange={this.handleChangefordp1}
                            />
                            <Input value={mypackage} onChange={this.handleTextChange} name='mypackage' />

                        </Grid.Row>
                        <Grid.Row textAlign='center'>
                            <Dropdown
                                placeholder="Parameters"
                                selection
                                options={dropdown2}
                                onChange={this.handleChangefordp2}
                            />
                        </Grid.Row>
                        <Grid.Row textAlign='center'>
                            <Dropdown
                                placeholder="Choices"
                                selection
                                options={dropdown3}
                                onChange={this.handleChangefordp3}
                            />
                        </Grid.Row>

                        <Grid.Row textAlign='center'>
                            <Button primary disabled={!(dp1 && dp2 && dp3)} onClick={this.onAddItem}>Submit</Button>
                            <Button primary onClick={this.refreshTextArea}>Refresh</Button>
                            {/* <Button primary onClick={this.exportData}>Export</Button> */}
                        </Grid.Row>
                    </Grid> : null
                }
                <Grid width={6}>
                    {!_.isEmpty(dataObject) && yamlText ?

                        // <ReactJson src={dataObject} />
                        <div>
                            {/* <TextArea as='textarea' rows='20' onChange={this.textAreaChange} value={yamlText}>{yamlText}</TextArea> */}
                            <textarea rows='20' cols='50' onChange={this.textAreaChange} value={yamlText} disabled>{yamlText}</textarea>
                            
                        </div>
                         : null
                    }
                </Grid>
            </Grid.Row>
        );
    }
}

export default CustomDropdown;