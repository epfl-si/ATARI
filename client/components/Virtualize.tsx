import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses, createFilterOptions } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import Typography from '@mui/material/Typography';
import { DigestUser } from '../../imports/api/DigestUser';

export default function Virtualize(props:{OPTIONS: DigestUser[], handleOneLastResult: Function}) {


const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  // console.log("dataSet");
  // console.log(dataSet[1] as DigestUser);


  return (
    <Typography component="li" {...dataSet[0]} noWrap >
      {`${dataSet[1].first_name} ${dataSet[1].last_name} ${dataSet[1].sciper} ${dataSet[1].email} ${dataSet[1].gaspar} ${dataSet[1].phone_number}`}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactChild[] = [];
  (children as React.ReactChild[]).forEach(
    (item: React.ReactChild & { children?: React.ReactChild[] }) => {
      itemData.push(...(item.children || []));
    },
  );
  // console.log("----------------------------");
  
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: React.ReactChild) => {
    if (child.hasOwnProperty('group')) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
      console.log('La taille de la liste change')
      if(itemData.length === 1) {
        console.log("Il ne reste plus qu' un seul résultat, c'est le moment d'afficher la personne !")
        console.log(itemData[0][0].key.split(' ')[2])
        console.log(itemData[0][1] as DigestUser)
        // setValue(itemData[0][1] as DigestUser)
        stateProps.handleOneLastResult(itemData[0][1] as DigestUser)
      }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

// const StyledPopper = styled(Popper)({
//   [`& .${autocompleteClasses.listbox}`]: {
//     boxSizing: 'border-box',
//     '& ul': {
//       padding: 0,
//       margin: 0,
//     },
//   },
// });

  const emptyStringArray:string[] = []
  const emptyDigestUserArray:DigestUser[] = []
  const emptyDigestUser:DigestUser = {"_id":"10","first_name":"","last_name":"","email":"slammertz9@nsw.gov.au","sciper":"80236","phone_number":"6673984279","gaspar":"Lammertz"}
  const [value, setValue] = React.useState<DigestUser|undefined>(undefined)
  const [stateProps, setStateProps] = React.useState(props)
  const [OPTIONS, setOPTIONS] = React.useState(stateProps.OPTIONS)
  const [digestUsers, setUserDigest] = React.useState(OPTIONS.map(x=>`${x.first_name} ${x.last_name} ${x.sciper} ${x.email} ${x.phone_number} ${x.gaspar}`))
  const filterOptions = (options, inputValue ) => {
    if (inputValue[inputValue.length - 1] === ' '){
      inputValue = inputValue.substring(0, inputValue.length - 1);
    }
    const inputArray = inputValue.split(" ");
    const tmpOption = OPTIONS;
    const result = OPTIONS.filter((x, i) => {
      const containsValue = Array.prototype.filter.call(Object.values(x), (y) =>
        inputArray.filter((z) => String(y).includes(z)).length === inputArray.length
      );
      if (containsValue.length > 0) {
        return true;
      }
    });
    console.log(options, inputValue);

    return result.slice(0, 5);
  };
  
  return (
    <Autocomplete
      autoHighlight={true}
      value={value === undefined ? "" : value}
      id="virtualize-demo"
      freeSolo
      sx={{ width: "60%", margin: "auto" }}
      // disableListWrap
      // PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      options={OPTIONS}
      groupBy={(option: DigestUser) => option.first_name[0].toUpperCase()}
      renderInput={(params) => (
        <TextField {...params} label="Search for a person" />
      )}
      renderOption={(props, option, state) =>
        [props, option, state.index] as React.ReactNode
      }
      filterOptions={(options, { inputValue }) =>
        filterOptions(options, inputValue)
      }
      getOptionLabel={(x) => (x === "" ? "" : x.first_name + " " + x.last_name)}
      onChange={(e, onChangeValue) => {
        if (onChangeValue !== null) {
          setValue(onChangeValue as DigestUser);
          stateProps.handleOneLastResult(onChangeValue as DigestUser);
        }
      }}
      onSelect={(val) => console.log("selected", value)}
      renderGroup={(params) => params as unknown as React.ReactNode}
    />
  );
}
