{
    function merge(hash, secondHash) {
        secondHash = secondHash[0]
        for(var i in secondHash)
            hash[i] = secondHash[i]

        return hash;
    }
}

Project
  = headComment:SingleLineComment? obj:Object NewLine
    {
        var proj = Object.create(null)
        proj.project = obj

        if (headComment) {
            proj.headComment = headComment
        }

        return proj;
    }

Anything
  = Char / EOF

Object
  = "{" obj:(AssignmentList / EmptyBody) "}"
    { return obj }

EmptyBody
  = _
    { return Object.create(null) }

AssignmentList
  = _ head:Assignment _ tail:((AssignmentList)*) _
    { 
      if (tail) return merge(head,tail)
      else return head
    }
    / _ section:DelimitedSection _
    {
        return section
    }

Assignment
  = id:Identifier _ "=" _ val:Value ";"
    { 
      var result = Object.create(null);
      result[id] = val
      return result
    }

DelimitedSection
  = begin:DelimitedSectionBegin _ fields:(AssignmentList / EmptyBody) _ DelimitedSectionEnd
    {
        var section = {}
        section[begin.name] = fields

        return section
    }

DelimitedSectionBegin
  = "/* Begin " sectionName:Identifier " section */" NewLine
    { return { name: sectionName } }

DelimitedSectionEnd
  = "/* End " sectionName:Identifier " section */" NewLine
    { return { name: sectionName } }

Identifier
  = id:[A-Za-z0-9]+
    { return id.join('') }

Value
  = obj:Object { return obj }
    / literal:Literal { return literal.join('') }

Literal
  = [^;\n]+

SingleLineComment
  = "//" _ contents:OneLineString NewLine
    { return contents }

Terminator
    = NewLine? EOF

OneLineString
  = contents:NonLine*
    { return contents.join('') }

_ "whitespace"
  = whitespace*

whitespace
  = NewLine / [\t ]

NonLine
  = !NewLine char:Char
    { return char }

NewLine
    = [\n\r]

EOF
    = !.

String
  = str:Char*
    { return str.join('') }

Char
  = .
