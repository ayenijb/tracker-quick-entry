import React from 'react';
import times from 'lodash.times';
// material-ui
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/lib/card';
//App
import RowComponent from './table-row';
import ProgramStageDropDown from './drop-down';
import ComponentCategories from './componentCategories';
//d2-ui
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
/*
TODO change collapsible-div height dynamically
TODO collapse option
TODO change stageData state structure accordingly. Maybe array of objects
*/
export default class CompositeRow extends React.Component {
  constructor(props,context){
    super(props);
    this.context=context;
    this.state = {
      animHeight:'0px',
      selectedStageIndex: 0,
      stageData : []
    }
    this.props = props;
  }

  _handleStageSelect(obj) {
    this.setState({
        selectedStageIndex: obj.target.value
    });
  }

  _handleEventChange =(id,cell) => {
      let row = this.state.stageData;
      let type = cell.type;
      switch (type) {
          case 'date': return (
              function(event,date) {
                  row[id] = date;
                  this.setState({
                      stageData:row
                  });
              }
          )
              break;
          case 'textbox': return (
              function(event) {
                  row[id] = event.target.value;
                  this.setState({
                      stageData: row
                  });
              }
          )
          break;
          case 'numeric': return (
              function(event) {
                  row[id] = event.target.value;
                  this.setState({
                      stageData: row
                  });
              }
          )
          break;
          case 'optionSet': return (
              function(obj) {
                  row[id] = cell.options[obj.target.value-1].displayName;
                  this.setState({
                      stageData: row
                  });
              }
          )
          break;
          default: return (
              function(event) {
                  row[id] = event.target.value;
                  this.setState({
                      stageData: row
                  });
              }
          )
      }
  }

  _handleUpdateFeild() {
      // validate stuff here
      console.log("updated");
  }

  render() {
    const styles = {
      noPad : {
        padding:'0px',
        height: 0,
        maxHeight:this.state.animHeight,
        transition:'max-height 1s ease'
      },
      cardStyle : {
        maxHeight:this.state.animHeight,
        transition:'max-height 1s ease',
        margin: '5px',
        overflowX: 'auto',
      }
    }

    const divStyles = {
        display:'inline-block',
        border: '1px solid',
        borderColor: this.context.muiTheme.rawTheme.palette.borderColor,
        borderRadius: '2px',
        padding: '10px',
        marginLeft: '2px',
        width: 'auto'
    }

    const bodyStyles= {
        overflowX:'visible',
        width: this.props.data.length*150
    }

    const programNames = this.props.data.programStages.map((stage,index) => (
        {displayName: stage.name, id: index}
    ))
    let component = {}, fields = [];
    return (
//Single outer-row start
      <TableRow >
      <TableRowColumn colSpan={this.props.data.headers.length} style={styles.noPad}>
      <Table {...this.props.tableProps}>
          <TableBody {...this.props.tableBodyProps} >
          {/*Row1 for data Entry*/}
          <RowComponent data={this.props.data.headers} expandToggle={function(){this.setState({animHeight:'500'})}.bind(this)}/>

          {/*Row2 for expandable Tab*/}
          <TableRow style={styles.noPad}>
          <TableRowColumn colSpan={this.props.data.headers.length} style={styles.noPad}>
          <Card style={styles.cardStyle}>
              <div style={{display:'flex'}}>
                  <CardHeader
                    title="Program Stage :"
                    style={{height:'30px'}}
                  />
                  <ProgramStageDropDown value='dropValue'
                      onChange={this._handleStageSelect.bind(this)}
                      menuItems={programNames}
                      includeEmpty={true}
                      emptyLabel='Select Program' />
              </div>
              <CardText>
                  <div style={{display:'flex'}}>

                      {this.props.data.programStages[this.state.selectedStageIndex].events.map((stageEvent,id) => {
                          component = ComponentCategories(stageEvent,id,this._handleEventChange(id,stageEvent).bind(this))
                          component.value = this.state.stageData[id]
                          fields = [component]
                          return (
                              <div key={id} style={divStyles}>
                                  <p>{stageEvent.name} :</p>
                                  <FormBuilder key={id} fields={fields} onUpdateField={this._handleUpdateFeild} />
                              </div>
                          )
                      })}
                  </div>
              </CardText>


          </Card>
          </TableRowColumn>
          </TableRow>
          </TableBody>
      </Table>
      </TableRowColumn>
      </TableRow>
//Single outer-row close.

    )
  }
}

CompositeRow.propTypes = {
    tableProps: React.PropTypes.object,
    tableHeaderProps: React.PropTypes.object,
    tableBodyProps: React.PropTypes.object,
    data: React.PropTypes.shape({
        headers: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            type: React.PropTypes.string.isRequired,
            required: React.PropTypes.bool
        })).isRequired,
        programStages: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            events: React.PropTypes.arrayOf(React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                type: React.PropTypes.string.isRequired,
                required: React.PropTypes.bool
            })).isRequired
        }))
    }).isRequired
}

CompositeRow.contextTypes = {muiTheme: React.PropTypes.object.isRequired};
