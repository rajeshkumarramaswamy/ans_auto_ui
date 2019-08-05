import React, { Component } from 'react';
import { Dropdown, Button, Grid } from "semantic-ui-react";
import _ from 'lodash';
import YAML from 'json-to-pretty-yaml';
import ReactJson from 'react-json-view'
import {yamprint} from 'yamprint';


class CustomDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dp1: false,
            dp2: false,
            dp3: false,
            dataObject: []
        }
    }

    handleChangefordp1 = (e, { value }) => this.setState({ dp1: value })
    handleChangefordp2 = (e, { value }) => this.setState({ dp2: value })
    handleChangefordp3 = (e, { value }) => this.setState({ dp3: value })

    onHandleSubmit = () => {
        let sample1 = {
            [this.state.dp1]: {
                'name': 'example1',
                [this.state.dp2]: this.state.dp3
            }
        }
        console.log('sampe', sample1);
        // this.setState({dataObject: samdb})
    }

    onAddItem = () => {
        // not allowed AND not working
        let sample1 = {
            'name': 'Enter your description here',
            [this.state.dp1]: {
                'name': ['package','package2'],
                [this.state.dp2]: this.state.dp3
            }
        }
        this.setState(state => {
            const list = state.dataObject.push(sample1);
            return list
        });
        
    };

    render() {
        const { data } = this.props
        const { dp1, dp2, dp3, dataObject } = this.state
        let dropdown1 = _.map(_.uniq(_.map(data, x => x['Module'])), (val) => ({ 'key': val, 'value': val, 'text': val }))
        let dropdown2 = _.map(_.uniq(_.map(data, x => x['Parameters'])), (val) => ({ 'key': val, 'value': val, 'text': val }))
        let dropdown3 = _.map(_.uniq(_.map(data, x => x['Choices'])), (val) => ({ 'key': val, 'value': val, 'text': val }))
        let yamlText = dataObject ? YAML.stringify(dataObject) : null
        let yamlTextA = dataObject ? yamprint(dataObject) : null
        console.log('yamlText', dataObject);
        return (
            <Grid.Row columns={2} style={{marginLeft: '100px'}}>
                {!_.isEmpty(data) ?
                    <Grid  divider columns={2} width={6}>
                        <Grid.Row textAlign='center'>
                            <Dropdown
                                placeholder="Module"
                                selection
                                options={dropdown1}
                                onChange={this.handleChangefordp1}
                            />

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
                            <Button primary onClick={this.props.refresh}>Refresh</Button>
                        </Grid.Row>
                    </Grid> : null
                }
                <Grid width={6}>
                    {!_.isEmpty(dataObject) && yamlText ?

                        // <ReactJson src={dataObject} />
                        <div>
                            <pre>
                            {yamlText}
                            </pre>
                        </div>
                         : null
                    }
                </Grid>
            </Grid.Row>
        );
    }
}

export default CustomDropdown;