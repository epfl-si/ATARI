import React, { useState, useEffect } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useFind, useSubscribe } from 'meteor/react-meteor-data'
import { Person, Persons } from '/imports/api/persons'
import CircularProgress from '@mui/material/CircularProgress'
import { useGlobalKeyboardEvent, useDeadMansSwitch } from '/imports/ui/use-hooks'
import '../css/SearchBar.css'

type SearchBarProps = {
    onSearchResultSelected ?: (p : Person) => void,
    onSingleSearchResult ?: (p : Person) => void,
    initialText ?: string
}

/**
 * The humble search bar (for people, rather than cats.)
 *
 * A short time after the user stops typing, start a `searchPersons`
 * DDP subscription with the contents of the search bar as the
 * parameter. Display the search results in a drop-down and let the
 * user select one.
 *
 * @param props.onSearchResultSelected Will be called when the user selects
 *                                     a search result out of the drop-down.
 * @param props.onSingleSearchResult   Will be called when the search narrows
 *                                     down to just one result.
 * @param props.initialText            At first render, the search bar will
 *                                     be pre-filled with this text on
 *                                     a strictly visual basis i.e.
 *                                     the component will *not*
 *                                     perform a search based on it.
 *                                     Can be changed by caller as
 *                                     long the user doesn't type
 *                                     anything; ignored afterwards.
 */
export function SearchBar(props: SearchBarProps) {
    // Whatever the user typed:
    const [searchQuery, setSearchQuery] = useState<string>();
    const isLoading = searchQuery ? useSubscribe("searchPersons", searchQuery) :
        useSubscribe(null);

    // While the search is in progress, we want to still be able to
    // click on the previously-retrieved search items. Meteor
    // conveniently guarantees that it will publish the new search
    // results over DDP before unpublishing the stale ones:
    const choosablePersons = useFind(() =>
        Persons.find({ searchResultFor: { $exists: true } }));

    const searchResultPersons = choosablePersons.filter(
        (p) => p.searchResultFor === searchQuery);

    useEffect(() => {
        if (searchResultPersons.length == 1 && props.onSingleSearchResult) {
            props.onSingleSearchResult(searchResultPersons[0]);
        }
    }, [searchResultPersons]);

    // Keyboard things go here
    const onTyping = useDeadMansSwitch<string>(setSearchQuery, 1000);

    useGlobalKeyboardEvent('Escape', function() {
        const searchBar = document.getElementById('atariSearchBar') as HTMLInputElement;
        if (searchBar) {
            searchBar.value = '';
            searchBar.focus();
        }
    });

    // JSX goes here
    return (
        <Autocomplete
            id="atariSearchBar"
            freeSolo
            ListboxProps={{ style: { maxHeight: 200, overflow: 'auto' } }}
            autoHighlight={true}
            sx={{ width: "60%", margin: "auto" }}
            value={ props.initialText }
            onChange={(_event, newPerson : Person) => {
                if(newPerson?._id) {
                    if (props.onSearchResultSelected) {
                        props.onSearchResultSelected(newPerson);
                    }
                }
            }}
            disablePortal
            disableClearable
            options={choosablePersons.map(
                (person) => ({
                    ...person,
                    label: `${person.display} ${person.id} ${person.email ? person.email : ''}`
                }))}
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
            onInputChange={ (_event, text, reason) => {
                if (reason != "input") return;
                onTyping(text.length < 3 ? undefined : text);
            } }
            renderInput={(params) => (
                <TextField {...params}
                    label="Search for a person"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isLoading() ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                />
            )}
        />
    )
}
