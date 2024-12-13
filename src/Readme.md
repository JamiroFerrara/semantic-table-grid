SemanticTableGrid example:

```js

var Data = require('./data');

<div>
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
<SemanticTableGrid
          rawProps={{ id: 'test'}}
          isLoading={false}
          elements={Data}
          rowClassKey={'class'}
          rowUniqueKey={'ccodice_scuola'}
          columns={[
            { key: 'cdenominazione', name: 'Nominativo', sortable: true,  width: '30%' },
            { key: 'cdes_tipo_scuola', name: 'Tipologia', sortable: true, width: '30%' },
            { key: 'indirizzo', name: <div><input type="button" value="This is a button Address" /></div>, sortable: false, formatter: ({value,data}) => { return `${data.cistat_prov} , ${data.cistat_com} , ${data.cindirizzo}`}},
          ]}
          canSort={{
            active: true,
            onSort: (key,order) => console.log(key,order),
          }}
          canSelect={{
            active: true,
            onSelect: (element) => console.log('select: ', element),
            onDeselect: (element) => console.log('deselect: ', element),
            selectAll: true,
            onSelectAll: () => console.log('Selected All!'),
            onDeselectAll: () => console.log('Deselected All!'),
            isSelectedProperty: 'selected',
          }}
          canPaginate={{
                active: true,
                pageCount: 10,
                pageSize: 10,
                totalItems: 100,
                page: 1,
                onSelect: (pageNumber) => console.log('change page to: ', pageNumber),
                pageMax: 5,
                componentsPosition: 'both',
                render: <div>This is a custom pagination Object</div>
            }}
          canAction={ {
                active: true,
                actions: [<div>Hallo!</div>,<div onClick={()=> console.log('PIZZA!')} >Click me if you want some Pizza!</div>],
          }}
          hiddenHeaderIfEmpty={true}
          emptyResults={<div>No results!</div>}
        />
</div>
```