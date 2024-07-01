import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { DigestUser } from '../../imports/api/DigestUser';
import CircularProgress from '@mui/material/CircularProgress';

function SearchBar(props:{handleOneLastResult: Function, sciper: string | undefined}) {

    const [users, setUsers] = React.useState([]);
    const [value, setValue] = React.useState('');
    const [stateProps, setStateProps] = React.useState(props)
    const [loading, setLoading] = React.useState(false);

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
                            label: `${person.display} ${person.id} ${person.email ? person.email : ''}`,
                        }
                    })
                    if(res.count == 1) {
                        window.history.pushState({ id:"100" }, "Page", `/${newPersons[0].id}`);
                        setValue(newPersons[0].display)
                        stateProps.handleOneLastResult(newPersons[0] as DigestUser);
                    }
                    setUsers(newPersons)
                    setLoading(false)
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
            filterOptions={(options) => options}
            renderOption={(props, option) => {
                if(!option.email) {
                    return (
                        <li {...props}>
                            <span style={{ color: 'grey' }}>{option.display} {option.id}</span>
                        </li>
                    )
                } else {
                    return (
                        <li {...props}>
                            <span>{option.display} {option.id} {option.email}</span>
                        </li>
                    )
                }
            }}
            onInput={(e) => e.target.value.length >= 3 ? (setLoading(true), getUsers(e.target.value)) : (setLoading(false), setUsers([]))}
            renderInput={(params) => (
                <TextField {...params}
                    label="Search for a person"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                />
            )}
        />
    )
}

export default SearchBar;