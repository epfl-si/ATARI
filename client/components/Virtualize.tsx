import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import Typography from '@mui/material/Typography';

export default function Virtualize(props:{OPTIONS: string[], handleOneLastResult: Function}) {



const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty('group')) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {`${dataSet[1]}`}
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
        stateProps.handleOneLastResult()
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

function random(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

  const emptyStringArray:string[] = []
  const [value, setValue] = React.useState(emptyStringArray)
  const [stateProps, setStateProps] = React.useState(props)
  return (
    <Autocomplete
      id="virtualize-demo"
      freeSolo
      sx={{ width: 300 }}
      disableListWrap
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      options={value}
      groupBy={(option) => option[0].toUpperCase()}
      renderInput={(params) => <TextField {...params} label="Search for a person" />}
      renderOption={(props, option, state) =>
        [props, option, state.index] as React.ReactNode
      }
      onInputChange={
        (e,inputValue) => {
          const phoneNumbers: string[] = [ '123456789', '987654321' ]
          const scipers: string[] = ['316898', '123456']
          const fullNames: string[] = ["Toto Le Poto", "Tutu La Tortue", "Paul Le Poulpe", "Gigi La Girafe"]
          const gaspar: string[] = ['lepoto', 'latortue', 'lepoulpe', 'lagirafe']
          const mailAdresses: string[] = ['toto.lepoto@example.com', 'tutu.latortue@example.ch']
          const phoneSciper: string[] = Array.prototype.concat(phoneNumbers, scipers)
          const gasparMailFullNames: string[] = Array.prototype.concat(gaspar, mailAdresses, fullNames)
          const isOnlyDigits = new RegExp(/^\d+$/).test(inputValue);
          const isMailAdress = new RegExp(/[.|@]/).test(inputValue);
          const containsOnlyLetters = new RegExp(/^[a-zA-Z]+$/).test(inputValue);
          if (isOnlyDigits) {
            // Is a number or a sciper
            setValue(phoneSciper)
          } else if (isMailAdress) {
            // Is a mail address
            console.log(isMailAdress)
            setValue(mailAdresses)
          } else if (containsOnlyLetters) {
            // Contains only letters
            setValue(gasparMailFullNames)
          } else {
            // Not valid or empty string
            setValue([])
          }
        }
      }
      // TODO: Post React 18 update - validate this conversion, look like a hidden bug
      renderGroup={(params) => params as unknown as React.ReactNode}
    />
  );
}
