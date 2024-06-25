import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { DigestUser } from '../../imports/api/DigestUser';

function SearchBar(props:{handleOneLastResult: Function, sciper: string | undefined}) {

    const [users, setUsers] = React.useState([]);
    const [value, setValue] = React.useState('');
    const [stateProps, setStateProps] = React.useState(props)

    React.useEffect(() => {
        stateProps.sciper && getUsers(stateProps.sciper)
    }, [])

    function getUsers(inputValue) {
        Meteor.call('getUser.query', inputValue, function(err, res) {
            if(err) {
                console.log(err)
            } else {
                if(res.persons) {
                    let newPersons = res.persons.map(person => {
                        return {
                            ...person,
                            label: `${person.display} ${person.id} ${person.email}`,
                        }
                    })
                    if(res.count == 1) {
                        window.history.pushState({ id:"100" }, "Page", `/${newPersons[0].id}`);
                        setValue(newPersons[0].display)
                        stateProps.handleOneLastResult(newPersons[0] as DigestUser);
                    }
                    setUsers(newPersons)
                }
            }
        })
    }

    return (
        <Autocomplete
            freeSolo
            ListboxProps={{ style: { maxHeight: 200, overflow: 'auto' } }}
            autoHighlight={true}
            sx={{ width: "60%", margin: "auto" }}
            value={value}
            onChange={(event, newValue) => {
                if(newValue?.id) {
                    setValue(newValue?.display)
                    window.history.pushState({ id:"100" }, "Page", `/${newValue?.id}`);
                    stateProps.handleOneLastResult(newValue as DigestUser);
                }
            }}
            disablePortal
            disableClearable
            options={users}
            onInput={(e) => e.target.value.length >= 3 ? getUsers(e.target.value) : setUsers([])}
            renderInput={(params) => <TextField {...params} label="Search for a person" />}
        />
    )
}

export default SearchBar;