# Wee Storage

Wee Storage is an interface to interact with local or session storage.

## Usage
Instantiate the storage controller, and pass the type of storage, either local or session, you would like to interface with as the first parameter.  The constructor will default to session storage.

```
var storage = Wee.fn.storage('local');
```

## Set
Set a value by passing it's key as the first paraemter, and it's value as the second parameter.
```
var storage = Wee.fn.storage();

storage.set('key', 'value');
```

You may also set nested values by using a period delimited string:

```
storage.set('key.key2.key3', 'value');
```

## Get

Retrieve a value from storage by it's key.

```
var storage = Wee.fn.storage();

var data = storage.get('key');
```

You may also retrieve nested properties and values by using a period delimited string:

```
var data = storage.get('key.key2.key3');
```