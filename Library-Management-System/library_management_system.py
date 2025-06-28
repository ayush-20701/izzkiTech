import json
import os
from datetime import datetime, timedelta
from abc import ABC, abstractmethod

class Book:
    """Book class to represent individual books in the library"""
    
    def __init__(self, book_id, title, author, isbn, category, total_copies=1):
        self.__book_id = book_id
        self.__title = title
        self.__author = author
        self.__isbn = isbn
        self.__category = category
        self.__total_copies = total_copies
        self.__available_copies = total_copies
        self.__issued_to = []  # List of member IDs who have issued this book
    
    # Getter methods (Encapsulation)
    @property
    def book_id(self):
        return self.__book_id
    
    @property
    def title(self):
        return self.__title
    
    @property
    def author(self):
        return self.__author
    
    @property
    def isbn(self):
        return self.__isbn
    
    @property
    def category(self):
        return self.__category
    
    @property
    def total_copies(self):
        return self.__total_copies
    
    @property
    def available_copies(self):
        return self.__available_copies
    
    @property
    def issued_to(self):
        return self.__issued_to.copy()
    
    def is_available(self):
        """Check if book is available for issuing"""
        return self.__available_copies > 0
    
    def issue_book(self, member_id):
        """Issue book to a member"""
        if self.is_available():
            self.__available_copies -= 1
            self.__issued_to.append(member_id)
            return True
        return False
    
    def return_book(self, member_id):
        """Return book from a member"""
        if member_id in self.__issued_to:
            self.__available_copies += 1
            self.__issued_to.remove(member_id)
            return True
        return False
    
    def to_dict(self):
        """Convert book object to dictionary for JSON serialization"""
        return {
            'book_id': self.__book_id,
            'title': self.__title,
            'author': self.__author,
            'isbn': self.__isbn,
            'category': self.__category,
            'total_copies': self.__total_copies,
            'available_copies': self.__available_copies,
            'issued_to': self.__issued_to
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create book object from dictionary"""
        book = cls(
            data['book_id'], data['title'], data['author'],
            data['isbn'], data['category'], data['total_copies']
        )
        book._Book__available_copies = data['available_copies']
        book._Book__issued_to = data['issued_to']
        return book
    
    def __str__(self):
        return f"ID: {self.__book_id} | Title: {self.__title} | Author: {self.__author} | Available: {self.__available_copies}/{self.__total_copies}"


class Member(ABC):
    """Abstract base class for library members"""
    
    def __init__(self, member_id, name, email, phone):
        self._member_id = member_id
        self._name = name
        self._email = email
        self._phone = phone
        self._issued_books = []  # List of book IDs issued to this member
        self._join_date = datetime.now().strftime("%Y-%m-%d")
    
    @property
    def member_id(self):
        return self._member_id
    
    @property
    def name(self):
        return self._name
    
    @property
    def email(self):
        return self._email
    
    @property
    def phone(self):
        return self._phone
    
    @property
    def issued_books(self):
        return self._issued_books.copy()
    
    @property
    def join_date(self):
        return self._join_date
    
    @abstractmethod
    def get_max_books(self):
        """Abstract method to get maximum books a member can issue"""
        pass
    
    @abstractmethod
    def get_issue_duration(self):
        """Abstract method to get issue duration in days"""
        pass
    
    @abstractmethod
    def get_member_type(self):
        """Abstract method to get member type"""
        pass
    
    def can_issue_book(self):
        """Check if member can issue more books"""
        return len(self._issued_books) < self.get_max_books()
    
    def issue_book(self, book_id):
        """Issue a book to this member"""
        if self.can_issue_book():
            self._issued_books.append(book_id)
            return True
        return False
    
    def return_book(self, book_id):
        """Return a book from this member"""
        if book_id in self._issued_books:
            self._issued_books.remove(book_id)
            return True
        return False
    
    def to_dict(self):
        """Convert member object to dictionary for JSON serialization"""
        return {
            'member_id': self._member_id,
            'name': self._name,
            'email': self._email,
            'phone': self._phone,
            'issued_books': self._issued_books,
            'join_date': self._join_date,
            'member_type': self.get_member_type()
        }
    
    def __str__(self):
        return f"ID: {self._member_id} | Name: {self._name} | Type: {self.get_member_type()} | Books Issued: {len(self._issued_books)}"


class Student(Member):
    """Student class inheriting from Member (Inheritance)"""
    
    def __init__(self, member_id, name, email, phone, student_id, course):
        super().__init__(member_id, name, email, phone)
        self.__student_id = student_id
        self.__course = course
    
    @property
    def student_id(self):
        return self.__student_id
    
    @property
    def course(self):
        return self.__course
    
    def get_max_books(self):  # Polymorphism
        """Students can issue maximum 3 books"""
        return 3
    
    def get_issue_duration(self):  # Polymorphism
        """Students get 14 days issue duration"""
        return 14
    
    def get_member_type(self):  # Polymorphism
        """Return member type"""
        return "Student"
    
    def to_dict(self):
        """Convert student object to dictionary"""
        data = super().to_dict()
        data.update({
            'student_id': self.__student_id,
            'course': self.__course
        })
        return data
    
    @classmethod
    def from_dict(cls, data):
        """Create student object from dictionary"""
        student = cls(
            data['member_id'], data['name'], data['email'],
            data['phone'], data['student_id'], data['course']
        )
        student._issued_books = data['issued_books']
        student._join_date = data['join_date']
        return student


class Faculty(Member):
    """Faculty class inheriting from Member (Inheritance)"""
    
    def __init__(self, member_id, name, email, phone, employee_id, department):
        super().__init__(member_id, name, email, phone)
        self.__employee_id = employee_id
        self.__department = department
    
    @property
    def employee_id(self):
        return self.__employee_id
    
    @property
    def department(self):
        return self.__department
    
    def get_max_books(self):  # Polymorphism
        """Faculty can issue maximum 5 books"""
        return 5
    
    def get_issue_duration(self):  # Polymorphism
        """Faculty get 30 days issue duration"""
        return 30
    
    def get_member_type(self):  # Polymorphism
        """Return member type"""
        return "Faculty"
    
    def to_dict(self):
        """Convert faculty object to dictionary"""
        data = super().to_dict()
        data.update({
            'employee_id': self.__employee_id,
            'department': self.__department
        })
        return data
    
    @classmethod
    def from_dict(cls, data):
        """Create faculty object from dictionary"""
        faculty = cls(
            data['member_id'], data['name'], data['email'],
            data['phone'], data['employee_id'], data['department']
        )
        faculty._issued_books = data['issued_books']
        faculty._join_date = data['join_date']
        return faculty


class LibrarySystem:
    """Main Library System class to manage all operations"""
    
    def __init__(self, data_file='library_data.json'):
        self.__books = {}  # Dictionary to store books
        self.__members = {}  # Dictionary to store members
        self.__data_file = data_file
        self.load_data()
    
    def load_data(self):
        """Load data from JSON file"""
        try:
            if os.path.exists(self.__data_file):
                with open(self.__data_file, 'r') as file:
                    data = json.load(file)
                    
                    # Load books
                    for book_data in data.get('books', []):
                        book = Book.from_dict(book_data)
                        self.__books[book.book_id] = book
                    
                    # Load members
                    for member_data in data.get('members', []):
                        if member_data['member_type'] == 'Student':
                            member = Student.from_dict(member_data)
                        else:
                            member = Faculty.from_dict(member_data)
                        self.__members[member.member_id] = member
            
            print("Data loaded successfully!")
        except Exception as e:
            print(f"Error loading data: {e}")
    
    def save_data(self):
        """Save data to JSON file"""
        try:
            data = {
                'books': [book.to_dict() for book in self.__books.values()],
                'members': [member.to_dict() for member in self.__members.values()]
            }
            
            with open(self.__data_file, 'w') as file:
                json.dump(data, file, indent=2)
            
            print("Data saved successfully!")
        except Exception as e:
            print(f"Error saving data: {e}")
    
    def add_book(self):
        """Add a new book to the library"""
        try:
            print("\n--- Add New Book ---")
            book_id = input("Enter Book ID: ").strip()
            
            if book_id in self.__books:
                print("Book ID already exists!")
                return
            
            title = input("Enter Title: ").strip()
            author = input("Enter Author: ").strip()
            isbn = input("Enter ISBN: ").strip()
            category = input("Enter Category: ").strip()
            total_copies = int(input("Enter Total Copies: "))
            
            book = Book(book_id, title, author, isbn, category, total_copies)
            self.__books[book_id] = book
            self.save_data()
            
            print(f"Book '{title}' added successfully!")
        
        except ValueError:
            print("Invalid input! Please enter valid data.")
        except Exception as e:
            print(f"Error adding book: {e}")
    
    def view_books(self):
        """Display all books in the library"""
        if not self.__books:
            print("No books in the library!")
            return
        
        print("\n--- Library Books ---")
        print(f"{'ID':<8} {'Title':<30} {'Author':<20} {'Category':<15} {'Available/Total':<15}")
        print("-" * 90)
        
        for book in self.__books.values():
            print(f"{book.book_id:<8} {book.title[:29]:<30} {book.author[:19]:<20} {book.category:<15} {book.available_copies}/{book.total_copies:<15}")
    
    def search_books(self):
        """Search books by title, author, or category"""
        if not self.__books:
            print("No books in the library!")
            return
        
        print("\n--- Search Books ---")
        print("1. Search by Title")
        print("2. Search by Author")
        print("3. Search by Category")
        
        choice = input("Enter your choice (1-3): ").strip()
        search_term = input("Enter search term: ").strip().lower()
        
        found_books = []
        
        for book in self.__books.values():
            if choice == '1' and search_term in book.title.lower():
                found_books.append(book)
            elif choice == '2' and search_term in book.author.lower():
                found_books.append(book)
            elif choice == '3' and search_term in book.category.lower():
                found_books.append(book)
        
        if found_books:
            print(f"\nFound {len(found_books)} book(s):")
            for book in found_books:
                print(book)
        else:
            print("No books found matching your search criteria!")
    
    def add_member(self):
        """Add a new member to the library"""
        try:
            print("\n--- Add New Member ---")
            member_id = input("Enter Member ID: ").strip()
            
            if member_id in self.__members:
                print("Member ID already exists!")
                return
            
            name = input("Enter Name: ").strip()
            email = input("Enter Email: ").strip()
            phone = input("Enter Phone: ").strip()
            
            print("Member Type:")
            print("1. Student")
            print("2. Faculty")
            
            member_type = input("Enter choice (1-2): ").strip()
            
            if member_type == '1':
                student_id = input("Enter Student ID: ").strip()
                course = input("Enter Course: ").strip()
                member = Student(member_id, name, email, phone, student_id, course)
            elif member_type == '2':
                employee_id = input("Enter Employee ID: ").strip()
                department = input("Enter Department: ").strip()
                member = Faculty(member_id, name, email, phone, employee_id, department)
            else:
                print("Invalid choice!")
                return
            
            self.__members[member_id] = member
            self.save_data()
            
            print(f"Member '{name}' added successfully!")
        
        except Exception as e:
            print(f"Error adding member: {e}")
    
    def view_members(self):
        """Display all members"""
        if not self.__members:
            print("No members registered!")
            return
        
        print("\n--- Library Members ---")
        for member in self.__members.values():
            print(member)
    
    def issue_book(self):
        """Issue a book to a member"""
        try:
            print("\n--- Issue Book ---")
            member_id = input("Enter Member ID: ").strip()
            book_id = input("Enter Book ID: ").strip()
            
            if member_id not in self.__members:
                print("Member not found!")
                return
            
            if book_id not in self.__books:
                print("Book not found!")
                return
            
            member = self.__members[member_id]
            book = self.__books[book_id]
            
            if not member.can_issue_book():
                print(f"Member has reached maximum book limit ({member.get_max_books()})!")
                return
            
            if not book.is_available():
                print("Book is not available!")
                return
            
            if book.issue_book(member_id) and member.issue_book(book_id):
                self.save_data()
                print(f"Book '{book.title}' issued to '{member.name}' successfully!")
                print(f"Return date: {(datetime.now() + timedelta(days=member.get_issue_duration())).strftime('%Y-%m-%d')}")
            else:
                print("Failed to issue book!")
        
        except Exception as e:
            print(f"Error issuing book: {e}")
    
    def return_book(self):
        """Return a book from a member"""
        try:
            print("\n--- Return Book ---")
            member_id = input("Enter Member ID: ").strip()
            book_id = input("Enter Book ID: ").strip()
            
            if member_id not in self.__members:
                print("Member not found!")
                return
            
            if book_id not in self.__books:
                print("Book not found!")
                return
            
            member = self.__members[member_id]
            book = self.__books[book_id]
            
            if book_id not in member.issued_books:
                print("This book is not issued to this member!")
                return
            
            if book.return_book(member_id) and member.return_book(book_id):
                self.save_data()
                print(f"Book '{book.title}' returned by '{member.name}' successfully!")
            else:
                print("Failed to return book!")
        
        except Exception as e:
            print(f"Error returning book: {e}")
    
    def view_issued_books(self):
        """View all issued books"""
        issued_books = []
        
        for member in self.__members.values():
            for book_id in member.issued_books:
                if book_id in self.__books:
                    book = self.__books[book_id]
                    issued_books.append({
                        'member_name': member.name,
                        'member_id': member.member_id,
                        'book_title': book.title,
                        'book_id': book.book_id
                    })
        
        if not issued_books:
            print("No books are currently issued!")
            return
        
        print("\n--- Currently Issued Books ---")
        print(f"{'Member Name':<20} {'Member ID':<12} {'Book Title':<30} {'Book ID':<10}")
        print("-" * 75)
        
        for item in issued_books:
            print(f"{item['member_name'][:19]:<20} {item['member_id']:<12} {item['book_title'][:29]:<30} {item['book_id']:<10}")
    
    def display_menu(self):
        """Display the main menu"""
        print("\n" + "="*50)
        print("       LIBRARY MANAGEMENT SYSTEM")
        print("="*50)
        print("1. Add Book")
        print("2. View All Books")
        print("3. Search Books")
        print("4. Add Member")
        print("5. View All Members")
        print("6. Issue Book")
        print("7. Return Book")
        print("8. View Issued Books")
        print("9. Exit")
        print("="*50)
    
    def run(self):
        """Main method to run the library system"""
        print("Welcome to Library Management System!")
        
        while True:
            self.display_menu()
            choice = input("Enter your choice (1-9): ").strip()
            
            if choice == '1':
                self.add_book()
            elif choice == '2':
                self.view_books()
            elif choice == '3':
                self.search_books()
            elif choice == '4':
                self.add_member()
            elif choice == '5':
                self.view_members()
            elif choice == '6':
                self.issue_book()
            elif choice == '7':
                self.return_book()
            elif choice == '8':
                self.view_issued_books()
            elif choice == '9':
                print("Thank you for using Library Management System!")
                break
            else:
                print("Invalid choice! Please enter a number between 1-9.")
            
            input("\nPress Enter to continue...")


def main():
    """Main function to start the application"""
    try:
        library = LibrarySystem()
        library.run()
    except KeyboardInterrupt:
        print("\n\nProgram interrupted by user. Goodbye!")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    main()