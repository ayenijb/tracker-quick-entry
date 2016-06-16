import React from 'react';

// material-ui
import {TableRow, TableRowColumn} from 'material-ui/lib/table';
import FontIcon from 'material-ui/lib/font-icon';

//d2-ui
import { wordToValidatorMap } from 'd2-ui/lib/forms/Validators';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';

//App
import ComponentCategories from './componentCategories';

export default class RowComponent extends React.Component {
    constructor(props,context) {
        super(props);
        this.context = context;
        this.state = Object.assign({},{
            rowValues: [],
            status: <FontIcon className="material-icons" color={this.context.muiTheme.rawTheme.palette.primary1Color}>mode_edit</FontIcon>
        });
        this.props = props;
    }

    _handleChange = (id,cell) => {
        let row = this.state.rowValues;
        console.log(this.state.rowValues, cell.type);
        let type = cell.type;
        switch (type) {
            case 'date': return (
                function(event,date) {
                    row[id] = date;
                    this.setState({
                        rowValues:row
                    });
                }
            )
                break;
            case 'textbox': return (
                function(event) {
                    row[id] = event.target.value;
                    this.setState({
                        rowValues: row
                    });
                }
            )
            break;
            case 'numeric': return (
                function(event) {
                    row[id] = event.target.value;
                    this.setState({
                        rowValues: row
                    });
                }
            )
            break;
            case 'optionSet': return (
                function(obj) {
                    row[id] = cell.options[obj.target.value-1].displayName;
                    this.setState({
                        rowValues: row
                    });
                }
            )
            break;
            default: return (
                function(event) {
                    row[id] = event.target.value;
                    this.setState({
                        rowValues: row
                    });
                }
            )
        }
    }

    _validateRow() {
        // TODO validate required feilds and save on server
        console.log("validated and saved");
        this.setState({
            status: <FontIcon className="material-icons" color={this.context.muiTheme.rawTheme.palette.successColor}>done</FontIcon>
        })
    }

    _handleButtonClick() {
        this.props.expandToggle();
        this.setState({
            status: <FontIcon className="material-icons" color={this.context.muiTheme.rawTheme.palette.successColor}>done</FontIcon>
        })
    }

    renderRow2() {
        let hc = null;
        const buttonColor = this.context.muiTheme.rawTheme.palette.primary1Color;
        return (
            this.props.data.map((cell,id) => {
                hc = this._handleChange(id,cell).bind(this);
                let component = ComponentCategories(cell,id,hc);
                component.value = this.state.rowValues[id];
                if(component.name === 'button') {
                    component.props.labelStyle = {color:this.context.muiTheme.rawTheme.palette.primary1Color};
                    component.props.onClick=this._handleButtonClick.bind(this);
                }
                else if (component.name ==='icon') {
                    component.props.children = this.state.status;
                }
                let fields = [component];
                return (
                    <TableRowColumn key={id}>
                        <FormBuilder key={id} fields={fields} onUpdateField={this.doSomething} />
                    </TableRowColumn>
                )
            }
        ))
    }

    render() {
        return(
            <TableRow key={this.props.key} style={{backgroundColor:'aliceBlue'}}>
              {this.renderRow2()}
            </TableRow>
        )
    }
};

RowComponent.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        required: React.PropTypes.bool
    })).isRequired,
    index: React.PropTypes.number,
};
RowComponent.defaultProps = { key: 'null'};
RowComponent.contextTypes = {muiTheme: React.PropTypes.object.isRequired};
